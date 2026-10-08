import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  Filter,
  Search,
  BookOpen,
  School,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import ExamCard from '../components/ExamCard';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

const PAGE_SIZE = 18;
const SEMESTERS = ['الكل', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

export default function CorrectedExamsPage() {
  const [selectedUni, setSelectedUni] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('الكل');
  const [selectedType, setSelectedType] = useState<'all' | 'officiel' | 'propose'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const universities = useMemo(() => StorageService.getUniversities(), []);
  const allCorrectedExams = useMemo(() => StorageService.getCorrectedExams(), []);

  // Filtered exams
  const filteredExams = useMemo(() => {
    return allCorrectedExams.filter((exam) => {
      // University filter
      if (selectedUni !== 'all' && exam.university_id !== selectedUni) {
        return false;
      }
      // Semester filter
      if (selectedSemester !== 'الكل' && exam.semester !== selectedSemester) {
        return false;
      }
      // Correction type filter
      if (selectedType !== 'all' && exam.correction_type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (exam.title || '').toLowerCase();
        const desc = (exam.description || '').toLowerCase();
        const tags = (exam.tags || []).join(' ').toLowerCase();
        if (!title.includes(q) && !desc.includes(q) && !tags.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [allCorrectedExams, selectedUni, selectedSemester, selectedType, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / PAGE_SIZE) || 1;
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredExams.slice(start, start + PAGE_SIZE);
  }, [filteredExams, currentPage]);

  const officialCount = useMemo(() => allCorrectedExams.filter(e => e.correction_type === 'officiel').length, [allCorrectedExams]);
  const proposedCount = useMemo(() => allCorrectedExams.filter(e => e.correction_type === 'propose').length, [allCorrectedExams]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="الامتحانات المصححة للجامعات المغربية | عناصر الإجابة والحلول PDF - ExamMaroc"
        description="بنك نماذج امتحانات الجامعات المغربية المصححة (S1 إلى S6) بصيغة PDF. حلول نموذجية وعناصر الإجابة الرسمية لكليات الحقوق والاقتصاد والعلوم والآداب بالمغرب."
        canonical="https://exammaroc.online/examens-corriges"
        keywords={[
          'امتحانات جامعية مصححة بالمغرب',
          'examens corriges universite maroc',
          'حلول امتحانات FSJES',
          'تصحيح امتحانات القانون والعلوم',
          'عناصر الإجابة امتحانات الجامعات',
          'امتحانات S1 S2 S3 S4 S5 S6 مصححة',
          'examens avec correction PDF Maroc'
        ]}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الامتحانات', to: '/examens' },
            { label: 'الامتحانات المصححة' },
          ]}
        />

        {/* Hero Banner */}
        <section className="mt-4 mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/40 p-6 sm:p-10 text-right shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <span className="chip bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 gap-1.5 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              مكتبة الامتحانات ذات الحلول النموذجية
            </span>

            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              نماذج امتحانات الجامعات المغربية مع التصحيح (Avec Corrigé)
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              ابحث عن نماذج الامتحانات الجامعية السابقة المرفقة بعناصر الإجابة الرسمية (Corrigé Officiel) أو الحلول النموذجية المقترحة لمساعدتك على التفوق في الدورة العادية والاستدراكية.
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 shadow-xs">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <strong>{allCorrectedExams.length}</strong> نموذج مصحح متوفر
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <strong>{officialCount}</strong> بتصحيح رسمي
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 shadow-xs">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <strong>{proposedCount}</strong> بحلول مقترحة مفصلة
              </span>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="card-academic p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث بالمادة، الشعبة، أو الكلية..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* University Select */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <School className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={selectedUni}
                  onChange={(e) => {
                    setSelectedUni(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="all">جميع الجامعات (12 جامعة)</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Correction Type */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedType === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الكل ({allCorrectedExams.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedType('officiel');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedType === 'officiel'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  رسمي ({officialCount})
                </button>
                <button
                  onClick={() => {
                    setSelectedType('propose');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedType === 'propose'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  مقترح ({proposedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Semesters Quick Filter Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">الفصل:</span>
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                onClick={() => {
                  setSelectedSemester(sem);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
                  selectedSemester === sem
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </section>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-500 font-medium">
          <p>
            عرض <strong className="text-slate-900 font-bold">{filteredExams.length}</strong> نموذج مصحح
            {selectedSemester !== 'الكل' && ` للفصل ${selectedSemester}`}
          </p>
          <span>
            الصفحة {currentPage} من {totalPages}
          </span>
        </div>

        {/* Exam Cards Grid */}
        {paginatedExams.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center card-academic p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-3">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-800">
              لم يتم العثور على نماذج مصححة تطابق هذا البحث
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              جرب تغيير الفصل الدراسي أو اختيار جامعة أخرى أو إزالة شروط البحث.
            </p>
            <button
              onClick={() => {
                setSelectedUni('all');
                setSelectedSemester('الكل');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="الصفحة السابقة"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pNum = i + 1;
              if (totalPages > 7 && currentPage > 4) {
                pNum = currentPage - 3 + i;
                if (pNum > totalPages) pNum = totalPages - (6 - i);
              }
              return (
                <button
                  key={pNum}
                  onClick={() => handlePageChange(pNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="الصفحة التالية"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
