import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  FileText,
  X,
  School,
  BookOpen,
  Layers,
  Search,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Faculty, Program, Subject } from '../data/initialData';
import Breadcrumbs, { BreadcrumbItem } from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const PAGE_SIZE = 24;
const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const SESSIONS = [
  { value: 'normale', label: 'دورة عادية' },
  { value: 'rattrapage', label: 'دورة الاستدراك' },
];

export default function ExamsPage() {
  const { uniSlug, progSlug, semester: routeSemester, subSlug } = useParams<{
    uniSlug?: string;
    progSlug?: string;
    semester?: string;
    subSlug?: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentUni, setCurrentUni] = useState<University | null>(null);
  const [currentProg, setCurrentProg] = useState<Program | null>(null);
  const [currentSub, setCurrentSub] = useState<Subject | null>(null);

  const [allUnis, setAllUnis] = useState<University[]>([]);
  const [allFaculties, setAllFaculties] = useState<Faculty[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);

  // Query filters
  const selectedSemester = routeSemester || searchParams.get('semester') || '';
  const selectedYear = searchParams.get('year') || '';
  const selectedSession = searchParams.get('session') || '';
  const selectedSubjectId = searchParams.get('subject') || '';
  const selectedFacId = searchParams.get('faculty') || '';
  const selectedCorrType = searchParams.get('correction') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const unis = StorageService.getUniversities();
    const subs = StorageService.getSubjects();
    setAllUnis(unis);
    setAllSubjects(subs);

    let uniObj: University | null = null;
    if (uniSlug) {
      uniObj = StorageService.getUniversityBySlug(uniSlug) || null;
      setCurrentUni(uniObj);
      if (uniObj) {
        setAllFaculties(StorageService.getFaculties(uniObj.id));
      }
    } else {
      setCurrentUni(null);
      setAllFaculties(StorageService.getFaculties());
    }

    if (uniObj && progSlug) {
      const p = StorageService.getProgramBySlug(uniObj.slug, progSlug) || null;
      setCurrentProg(p);
    } else {
      setCurrentProg(null);
    }

    if (subSlug) {
      const s = StorageService.getSubjectBySlug(subSlug) || null;
      setCurrentSub(s);
    } else {
      setCurrentSub(null);
    }
  }, [uniSlug, progSlug, subSlug]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filtered exams
  const filteredExams = useMemo(() => {
    return StorageService.getExams({
      university_id: currentUni?.id,
      faculty_id: selectedFacId || undefined,
      program_id: currentProg?.id,
      subject_id: currentSub?.id || (selectedSubjectId || undefined),
      semester: selectedSemester || undefined,
      year: selectedYear || undefined,
      session: selectedSession || undefined,
      correction_type: (selectedCorrType as any) || undefined,
      search: searchQuery || undefined,
    });
  }, [
    currentUni,
    selectedFacId,
    currentProg,
    currentSub,
    selectedSubjectId,
    selectedSemester,
    selectedYear,
    selectedSession,
    selectedCorrType,
    searchQuery
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / PAGE_SIZE) || 1;
  const paginatedExams = useMemo(() => {
    const start = (currentPageParam - 1) * PAGE_SIZE;
    return filteredExams.slice(start, start + PAGE_SIZE);
  }, [filteredExams, currentPageParam]);

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const availableYears = useMemo(() => {
    const all = StorageService.getExams();
    const set = new Set(all.map((e) => e.year).filter(Boolean));
    return Array.from(set).sort((a, b) => b - a);
  }, []);

  // Construct Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'الرئيسية', to: '/' },
    { label: 'الامتحانات', to: '/examens' },
  ];

  if (currentUni) {
    breadcrumbs.push({
      label: currentUni.name_ar,
      to: `/examens/${currentUni.slug}`,
    });
  }

  if (currentUni && currentProg) {
    breadcrumbs.push({
      label: currentProg.name_fr || currentProg.name_ar,
      to: `/universites/${currentUni.slug}/${currentProg.slug}`,
    });
  }

  if (selectedSemester && currentUni && currentProg) {
    breadcrumbs.push({
      label: selectedSemester,
      to: `/examens/${currentUni.slug}/${currentProg.slug}/${selectedSemester}`,
    });
  } else if (selectedSemester) {
    breadcrumbs.push({
      label: selectedSemester,
    });
  }

  if (currentSub) {
    breadcrumbs.push({
      label: currentSub.name_fr || currentSub.name_ar,
    });
  }

  // SEO Title & Description with CTR Boosters & Long-Tail Keywords
  const seoTitle = currentSub
    ? `امتحانات ${currentSub.name_ar} (${currentSub.name_fr}) ${selectedSemester ? `الفصل ${selectedSemester}` : ''} مع التصحيح [PDF مجاناً] | ExamMaroc`
    : selectedSemester && currentProg && currentUni
    ? `امتحانات ${selectedSemester} شعبة ${currentProg.name_fr || currentProg.name_ar} – ${currentUni.name_ar} مع عناصر الإجابة [PDF] | ExamMaroc`
    : selectedSemester
    ? `امتحانات الفصل ${selectedSemester} لجميع كليات المغرب مع التصحيح النموذجي [PDF] | ExamMaroc`
    : currentUni
    ? `نماذج امتحانات ${currentUni.name_ar} مع التصحيح الرسمي لجميع الكليات [PDF مجاناً] | ExamMaroc`
    : 'نماذج امتحانات الجامعات المغربية مع عناصر الإجابة والتصحيح الرسمي [PDF مجاناً] | ExamMaroc';

  const seoDescription = `بنك امتحانات جامعية سابقة بصيغة PDF ${
    currentUni ? `لجامعة ${currentUni.name_ar}` : 'لكافة الجامعات المغربية الـ 12'
  } ${currentProg ? `شعبة ${currentProg.name_fr || currentProg.name_ar}` : ''} ${
    selectedSemester ? `الفصل ${selectedSemester}` : ''
  } ${currentSub ? `مادة ${currentSub.name_ar} (${currentSub.name_fr})` : ''} مع عناصر الإجابة والتصحيح النموذجي للدورة العادية والاستدراكية بروابط تحميل سريعة.`;

  const examsFaqs = [
    {
      question: 'كيف أبحث عن امتحان محدد في بنك الامتحانات؟',
      answer: 'يمكنك استخدام شريط البحث العلوي للبحث باسم المادة أو الكلية أو الأستاذ، أو تصفية النتائج باختيار الفصل (S1 إلى S6) والجامعة وسنة الامتحان ونوع التصحيح.',
    },
    {
      question: 'هل تتوفر امتحانات الدورة العادية والاستدراكية؟',
      answer: 'نعم، تشمل المنصة نماذج امتحانات الدورة العادية (Session Normale) ودورة الاستدراك (Session Rattrapage) لمعظم الكليات المغربية.',
    },
    {
      question: 'هل تحميل الامتحانات مجاني؟',
      answer: 'نعم، جميع نماذج الامتحانات وعناصر الإجابة بصيغة PDF متاحة للتحميل المباشر مجاناً بدون أي اشتراك أو قيود.',
    },
  ];

  const hasActiveFilters = Boolean(
    (!routeSemester && selectedSemester) ||
    selectedYear ||
    selectedSession ||
    selectedSubjectId ||
    selectedFacId ||
    (selectedCorrType && selectedCorrType !== 'all') ||
    searchQuery
  );

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={window.location.pathname.startsWith('/examens') ? `https://exammaroc.online${window.location.pathname}` : 'https://exammaroc.online/examens'}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.to || window.location.pathname,
        }))}
        faqs={examsFaqs}
      />

      <div className="container-academic py-8">
        <Breadcrumbs items={breadcrumbs} />

        <header className="mt-4 mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {currentSub
              ? `نماذج امتحانات ${currentSub.name_fr || currentSub.name_ar}`
              : selectedSemester && currentProg
              ? `امتحانات ${selectedSemester} — ${currentProg.name_fr}`
              : currentUni
              ? `امتحانات ${currentUni.name_ar}`
              : 'بنك نماذج امتحانات الجامعات المغربية'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            تصفح وحمّل نماذج الامتحانات السابقة بصيغة PDF مع البحث والفلترة حسب الكلية، الدورة، الفصل والتصحيح.
          </p>
        </header>

        {/* Quick Horizontal Semester Strip for Mobile & Desktop */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateParam('semester', '')}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              !selectedSemester
                ? 'bg-blue-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            جميع الفصول
          </button>
          {SEMESTERS.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => updateParam('semester', selectedSemester === sem ? '' : sem)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedSemester === sem
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {sem}
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateParam('correction', selectedCorrType === 'officiel' ? 'all' : 'officiel')}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedCorrType === 'officiel'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            ✓ المصححة رسمياً
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                <Filter className="h-4 w-4 text-blue-600" />
                <span>تصفية وبحث في الأرشيف ({filteredExams.length} امتحان)</span>
              </span>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="inline-flex sm:hidden items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                <span>{mobileFiltersOpen ? 'إخفاء الفلاتر' : 'تخصيص الفلاتر'}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="h-3 w-3" />
                <span>إلغاء جميع الفلاتر</span>
              </button>
            )}
          </div>

          {/* Search bar inside filter */}
          <div className="relative">
            <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، اسم الأستاذ، الموضوع، أو الكلمات المفتاحية..."
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className={`gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-1 ${mobileFiltersOpen ? 'grid' : 'hidden sm:grid'}`}>
            {/* Semester selector */}
            {!routeSemester && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  الفصل الدراسي (Semestre)
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => updateParam('semester', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="">جميع الفصول (S1 - S6)</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* University selector if not locked by route */}
            {!uniSlug && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  الجامعة (12 جامعة مغربية)
                </label>
                <select
                  value={searchParams.get('uni') || ''}
                  onChange={(e) => {
                    const uSlug = e.target.value;
                    if (uSlug) {
                      window.location.href = `/examens/${uSlug}`;
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="">كل الجامعات</option>
                  {allUnis.map((u) => (
                    <option key={u.id} value={u.slug}>
                      {u.name_ar}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Faculty selector */}
            {allFaculties.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  الكلية / المؤسسة
                </label>
                <select
                  value={selectedFacId}
                  onChange={(e) => updateParam('faculty', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="">جميع الكليات</option>
                  {allFaculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name_ar}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Correction Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                عناصر الإجابة والتصحيح
              </label>
              <select
                value={selectedCorrType}
                onChange={(e) => updateParam('correction', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white font-medium"
              >
                <option value="all">الكل (مع وبدون تصحيح)</option>
                <option value="officiel">مع التصحيح الرسمي فقط</option>
                <option value="propose">مع الحل المقترح</option>
                <option value="sans_corrige">بدون تصحيح (الموضوع فقط)</option>
              </select>
            </div>

            {/* Session Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                الدورة (Session)
              </label>
              <select
                value={selectedSession}
                onChange={(e) => updateParam('session', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">كل الدورات</option>
                {SESSIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                السنة (Année)
              </label>
              <select
                value={selectedYear}
                onChange={(e) => updateParam('year', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">جميع السنوات</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Current Page */}
        <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium">
          <span>
            تم العثور على <strong className="text-blue-600 font-bold">{filteredExams.length}</strong> نموذج امتحان
          </span>
          <span>
            الصفحة {currentPageParam} من {totalPages}
          </span>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <FileText className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-slate-800">
              لم نعثر على نماذج تطابق الفلاتر المحددة
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              جرب تغيير معايير التصفية أو البحث في مواد وفصول أخرى.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                إعادة ضبط كل الفلاتر
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPageParam - 1))}
              disabled={currentPageParam === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="الصفحة السابقة"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pNum = i + 1;
              if (totalPages > 7 && currentPageParam > 4) {
                pNum = currentPageParam - 3 + i;
                if (pNum > totalPages) pNum = totalPages - (6 - i);
              }
              return (
                <button
                  key={pNum}
                  onClick={() => handlePageChange(pNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPageParam === pNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPageParam + 1))}
              disabled={currentPageParam === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="الصفحة التالية"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </nav>
        )}

        <AdSlot />
      </div>
    </>
  );
}
