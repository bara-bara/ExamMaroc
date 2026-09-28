import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, BookOpen, ArrowLeft, Calendar, FileText, AlertCircle } from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Program } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

export default function ProgramDetailPage() {
  const { uniSlug, progSlug } = useParams<{ uniSlug: string; progSlug: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [semesterCounts, setSemesterCounts] = useState<Record<string, number>>({});
  const [exams, setExams] = useState<EnrichedExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uniSlug || !progSlug) return;
    setLoading(true);

    const uni = StorageService.getUniversityBySlug(uniSlug);
    if (uni) {
      setUniversity(uni);
      const prog = StorageService.getProgramBySlug(uni.slug, progSlug);
      if (prog) {
        setProgram(prog);
        const progExams = StorageService.getExams({
          university_id: uni.id,
          program_id: prog.id,
        });
        setExams(progExams);

        const counts: Record<string, number> = {};
        progExams.forEach((e) => {
          if (e.semester) {
            counts[e.semester] = (counts[e.semester] || 0) + 1;
          }
        });
        setSemesterCounts(counts);
      } else {
        setProgram(null);
      }
    } else {
      setUniversity(null);
    }

    setLoading(false);
  }, [uniSlug, progSlug]);

  if (loading) {
    return (
      <div className="container-academic py-16 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-slate-500">جارٍ تحميل بيانات الشعبة...</p>
      </div>
    );
  }

  if (!university || !program) {
    return (
      <div className="container-academic py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900">
          الشعبة غير موجودة
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          قد يكون الرابط غير صحيح أو تم تحديثه.
        </p>
        <Link
          to="/universites"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <span>تصفح الجامعات</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`امتحانات شعبة ${program.name_fr} - ${university.name_ar} | ExamMaroc`}
        description={
          program.description ||
          `نماذج امتحانات شعبة ${program.name_fr} (${program.name_ar}) بجامعة ${university.name_ar}. منظمة حسب الفصل الدراسي S1, S2, S3, S4, S5, S6 بصيغة PDF.`
        }
        canonical={`https://exammaroc.app/universites/${university.slug}/${program.slug}`}
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الجامعات', url: '/universites' },
          { name: university.name_ar, url: `/universites/${university.slug}` },
          { name: program.name_fr, url: `/universites/${university.slug}/${program.slug}` },
        ]}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الجامعات', to: '/universites' },
            { label: university.name_ar, to: `/universites/${university.slug}` },
            { label: program.name_fr },
          ]}
        />

        {/* Header */}
        <header className="mt-4 mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <span className="chip bg-purple-50 text-purple-700 font-semibold mb-1">
              شعبة ومسلك دراسي
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              {program.name_fr}
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              {program.name_ar} · {university.name_ar}
            </p>
            {program.description && (
              <p className="pt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
                {program.description}
              </p>
            )}
          </div>
        </header>

        {/* Semesters Grid */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>الفصول الدراسية (Semestres)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SEMESTERS.map((sem) => {
              const count = semesterCounts[sem] || 0;
              return (
                <Link
                  key={sem}
                  to={`/examens/${university.slug}/${program.slug}/${sem}`}
                  className="card-academic p-5 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all group"
                >
                  <span className="font-heading text-2xl font-bold text-blue-600 group-hover:scale-110 inline-block transition-transform">
                    {sem}
                  </span>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    {count > 0 ? `${count} امتحان` : 'لا يوجد'}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <AdSlot />

        {/* Exams in this Program */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>امتحانات شعبة {program.name_fr}</span>
            </h2>
            <span className="chip bg-slate-100 text-slate-700 text-xs">
              {exams.length} نموذج متوفر
            </span>
          </div>

          {exams.length === 0 ? (
            <div className="card-academic p-8 text-center text-slate-500">
              لم تتم إضافة نماذج امتحانات لهذه الشعبة حتى الآن.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
