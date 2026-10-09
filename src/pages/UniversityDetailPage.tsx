import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { School, MapPin, Layers, FileText, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Faculty, Program } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function UniversityDetailPage() {
  const { uniSlug } = useParams<{ uniSlug: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exams, setExams] = useState<EnrichedExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uniSlug) return;
    setLoading(true);
    const uni = StorageService.getUniversityBySlug(uniSlug);
    if (uni) {
      setUniversity(uni);
      setFaculties(StorageService.getFaculties(uni.id));
      setPrograms(StorageService.getPrograms(uni.id));
      setExams(StorageService.getExams({ university_id: uni.id, limit: 12 }));
    } else {
      setUniversity(null);
    }
    setLoading(false);
  }, [uniSlug]);

  if (loading) {
    return (
      <div className="container-academic py-16 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-slate-500">جارٍ تحميل بيانات الجامعة...</p>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="container-academic py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900">
          الجامعة غير موجودة
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          قد يكون الرابط غير صحيح أو تم تحديثه.
        </p>
        <Link
          to="/universites"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <span>تصفح كل الجامعات</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: university.name_ar,
    alternateName: university.name_fr,
    description: university.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: university.city,
      addressCountry: 'MA',
    },
    url: `https://exammaroc.online/universites/${university.slug}`,
  };

  return (
    <>
      <SEO
        title={`نماذج امتحانات ${university.name_ar} مع التصحيح [PDF مجاناً] - كليات ${university.city_ar} | ExamMaroc`}
        description={
          `تحميل ومشاهدة نماذج امتحانات ${university.name_ar} بـ${university.city_ar} لجميع الكليات (FSJES، العلوم، الآداب) من الفصل S1 إلى S6 بصيغة PDF مع عناصر الإجابة والتصحيح الرسمي للدورة العادية والاستدراكية مجاناً.`
        }
        canonical={`https://exammaroc.online/universites/${university.slug}`}
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الجامعات', url: '/universites' },
          { name: university.name_ar, url: `/universites/${university.slug}` },
        ]}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الجامعات', to: '/universites' },
            { label: university.name_ar },
          ]}
        />

        {/* Header Profile */}
        <header className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <span className="chip bg-blue-50 text-blue-700 font-semibold mb-1">
              مؤسسة جامعية مغربية
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              {university.name_ar}
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              {university.name_fr}
            </p>
            <p className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium pt-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{university.city_ar} · {university.city}</span>
            </p>
            {university.description && (
              <p className="pt-2 text-sm text-slate-600 leading-relaxed">
                {university.description}
              </p>
            )}
          </div>

          <Link
            to={`/examens/${university.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all self-start sm:self-center"
          >
            <FileText className="h-4 w-4" />
            <span>كل امتحانات {university.name_ar}</span>
          </Link>
        </header>

        {/* Faculties Section */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <School className="h-5 w-5 text-blue-600" />
            <span>الكليات والمؤسسات التابعة</span>
          </h2>

          {faculties.length === 0 ? (
            <p className="text-sm text-slate-500">لا توجد كليات مضافة بعد لهذه الجامعة.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {faculties.map((fac) => {
                const facPrograms = programs.filter((p) => p.faculty_id === fac.id);
                return (
                  <div
                    key={fac.id}
                    className="card-academic p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-slate-900">
                        {fac.name_ar}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{fac.name_fr}</p>
                      {fac.description && (
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                          {fac.description}
                        </p>
                      )}
                    </div>
                    {facPrograms.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] text-slate-400 font-medium block mb-1">
                          الشعب:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {facPrograms.map((p) => (
                            <Link
                              key={p.id}
                              to={`/universites/${university.slug}/${p.slug}`}
                              className="chip bg-blue-50 text-blue-700 text-[11px] hover:bg-blue-100"
                            >
                              {p.name_fr}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Programs / Filières */}
        {programs.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>الشعب والمسالك المتاحة (Filières)</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((prog) => {
                const progExamsCount = StorageService.getExams({
                  university_id: university.id,
                  program_id: prog.id,
                }).length;

                return (
                  <Link
                    key={prog.id}
                    to={`/universites/${university.slug}/${prog.slug}`}
                    className="card-academic p-5 flex items-center justify-between hover:border-blue-300 group"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {prog.name_fr}
                      </h3>
                      <p className="text-xs text-slate-500">{prog.name_ar}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="chip bg-slate-100 text-slate-700 text-xs">
                        {progExamsCount} امتحان
                      </span>
                      <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <AdSlot />

        {/* Latest Exams for this University */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>أحدث نماذج امتحانات {university.name_ar}</span>
            </h2>
            <Link
              to={`/examens/${university.slug}`}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              عرض جميع امتحانات الجامعة ←
            </Link>
          </div>

          {exams.length === 0 ? (
            <div className="card-academic p-8 text-center text-slate-500">
              لا توجد امتحانات مضافة بعد لهذه الجامعة.
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
