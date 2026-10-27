import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  School,
  MapPin,
  Layers,
  FileText,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Clock,
  Printer,
  FileCheck,
  Search,
  Filter,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Download,
  Award,
  Table,
  LayoutGrid,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Faculty, Program } from '../data/initialData';
import { UNIVERSITY_GUIDES, UniversityGuide } from '../data/universityGuides';
import Breadcrumbs from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO, { FAQItem } from '../components/SEO';

interface UniversityDetailPageProps {
  defaultUniSlug?: string;
}

export default function UniversityDetailPage({ defaultUniSlug }: UniversityDetailPageProps) {
  const { uniSlug: paramUniSlug } = useParams<{ uniSlug: string }>();
  const uniSlug = defaultUniSlug || paramUniSlug;

  const [university, setUniversity] = useState<University | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [allExams, setAllExams] = useState<EnrichedExam[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [onlyCorrected, setOnlyCorrected] = useState<boolean>(false);
  const [examSearchQuery, setExamSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!uniSlug) return;
    setLoading(true);
    const uni = StorageService.getUniversityBySlug(uniSlug);
    if (uni) {
      setUniversity(uni);
      setFaculties(StorageService.getFaculties(uni.id));
      setPrograms(StorageService.getPrograms(uni.id));
      // Fetch all verified exams belonging to this university
      const uniExams = StorageService.getExams({ university_id: uni.id });
      setAllExams(uniExams);
    } else {
      setUniversity(null);
    }
    setLoading(false);
  }, [uniSlug]);

  const guide: UniversityGuide | undefined = university ? UNIVERSITY_GUIDES[university.slug] : undefined;

  // Filtered programs based on selected faculty
  const availablePrograms = useMemo(() => {
    if (selectedFaculty === 'all') return programs;
    return programs.filter((p) => p.faculty_id === selectedFaculty);
  }, [programs, selectedFaculty]);

  // Filtered exams
  const filteredExams = useMemo(() => {
    let list = [...allExams];

    if (selectedFaculty !== 'all') {
      list = list.filter((e) => e.faculty_id === selectedFaculty);
    }

    if (selectedSemester !== 'all') {
      list = list.filter((e) => e.semester === selectedSemester);
    }

    if (selectedProgram !== 'all') {
      list = list.filter((e) => e.program_id === selectedProgram);
    }

    if (selectedSession !== 'all') {
      list = list.filter((e) => e.session === selectedSession);
    }

    if (onlyCorrected) {
      list = list.filter((e) => e.has_correction || e.correction_type !== 'sans_corrige');
    }

    if (examSearchQuery.trim()) {
      const q = examSearchQuery.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e._subject && (e._subject.name_ar.toLowerCase().includes(q) || e._subject.name_fr.toLowerCase().includes(q))) ||
          (e._faculty && (e._faculty.name_ar.toLowerCase().includes(q) || e._faculty.name_fr.toLowerCase().includes(q))) ||
          (e._program && (e._program.name_ar.toLowerCase().includes(q) || e._program.name_fr.toLowerCase().includes(q))) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [allExams, selectedFaculty, selectedSemester, selectedProgram, selectedSession, onlyCorrected, examSearchQuery]);

  if (loading) {
    return (
      <div className="container-academic py-16 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-slate-500">جارٍ تجهيز دليل وجدول امتحانات الجامعة...</p>
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
          <span>تصفح دليل الجامعات الـ 12</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const pageTitle = `امتحانات ${university.name_ar} مع التصحيح PDF [جدول الامتحانات المتاحة] | ExamMaroc`;
  const pageDescription = `جدول كامل ومفصل لجميع امتحانات كليات ${university.name_ar} (${university.name_fr} - ${university.city_ar}) مقسمة حسب الكلية والشعبة من الفصل S1 إلى S6 بصيغة PDF مع عناصر الإجابة ودليل سحب الاستدعاء.`;
  const canonicalUrl = `https://www.exammaroc.online/universites/${university.slug}`;

  // Structured Data (Schema.org)
  const jsonLd = [
    {
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
      url: canonicalUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: filteredExams.slice(0, 30).map((exam, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: exam.title,
          url: `https://www.exammaroc.online/examens/${exam.slug}`,
        })),
      },
    },
  ];

  const universityFaqs = guide?.faqs || [
    {
      question: `كيف أحصل على امتحانات ${university.name_ar} مع التصحيح؟`,
      answer: `يوفر موقع ExamMaroc جدولاً شاملاً لنماذج امتحانات كليات ${university.name_ar} بصيغة PDF مجانية بروابط مباشرة مع عناصر الإجابة والحلول المعتمدة.`,
    },
    {
      question: `كيف يتم سحب استدعاء امتحانات ${university.name_ar}؟`,
      answer: `يتم سحب الاستدعاء عبر الفضاء الرقمي للطالب الخاص بـ ${university.name_ar} بإدخال الرقم الوطني CNE ورقم التسجيل وطباعة بطاقة الاستدعاء قبل موعد الاختبار.`,
    },
  ];

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        keywords={[
          `امتحانات ${university.name_ar}`,
          `نماذج امتحانات ${university.name_ar}`,
          `جدول امتحانات ${university.name_ar}`,
          `استدعاء امتحانات ${university.name_ar}`,
          `امتحانات كليات ${university.city_ar}`,
          university.name_fr,
          guide?.acronym || '',
          'امتحانات مصححة PDF',
          'FSJES',
          'FLSH',
          'FS',
          'S1 S2 S3 S4 S5 S6'
        ].filter(Boolean)}
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الجامعات المغربية', url: '/universites' },
          { name: university.name_ar, url: `/universites/${university.slug}` },
        ]}
        faqs={universityFaqs}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-4 sm:py-8 space-y-6 sm:space-y-10">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الجامعات', to: '/universites' },
            { label: university.name_ar },
          ]}
        />

        {/* Hero Banner Profile */}
        <header className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white p-5 sm:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-blue-500/20 text-blue-200 border border-blue-400/30 font-bold text-[11px] sm:text-xs">
                  مؤسسة جامعية مغربية معتمدة 🇲🇦
                </span>
                {guide && (
                  <span className="chip bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-bold text-[11px] sm:text-xs">
                    تأسست سنة {guide.established} ({guide.acronym})
                  </span>
                )}
                <span className="chip bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold text-[11px] sm:text-xs">
                  {allExams.length} نموذج امتحان متوفر
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                امتحانات {university.name_ar} والكليات التابعة لها
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 font-medium">
                {university.name_fr} {guide ? `(${guide.acronym})` : ''}
              </p>

              <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-300 font-semibold">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{university.city_ar} · {university.city} ({guide ? guide.region : 'المملكة المغربية'})</span>
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {guide?.hero_tag || university.description}
              </p>
            </div>

            {/* Quick action buttons in hero */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              <a
                href="#exam-table-section"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all text-center"
              >
                <Table className="h-4 w-4" />
                <span>جدول الامتحانات المتاحة ({allExams.length})</span>
              </a>

              {guide && (
                <a
                  href="#convocation-guide"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all text-center"
                >
                  <Printer className="h-4 w-4 text-emerald-400" />
                  <span>دليل الاستدعاء والبوابة</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* University Convocation & Exam Guide Section */}
        {guide && (
          <section id="convocation-guide" className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg sm:text-2xl font-black text-slate-900">
                    دليل امتحانات {university.name_ar} 2026: الاستدعاء والبوابات الرسمية
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    إرشادات معتمدة لطلبة كليات ومؤسسات {university.name_ar} بـ{university.city_ar}
                  </p>
                </div>
              </div>

              {guide.portal_url && (
                <a
                  href={guide.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <span>{guide.portal_name}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Steps */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <Printer className="h-4 w-4" />
                  <span>طريقة سحب الاستدعاء</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {guide.convocation_steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Documents */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <FileCheck className="h-4 w-4" />
                  <span>الوثائق الإلزامية بالقاعة</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {guide.mandatory_docs.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Rules */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <ShieldAlert className="h-4 w-4" />
                  <span>ضوابط قاعات الامتحانات</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.rules_summary}
                </p>
              </div>

              {/* Card 4: Calendar */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>برمجة الامتحانات 2026</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.exam_calendar_note}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Faculties & Programs Directory */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <School className="h-5 w-5 text-blue-600" />
              <span>كليات ومؤسسات {university.name_ar} ({faculties.length} مؤسسة)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              انقر على أي كلية لتصفية امتحاناتها في الجدول
            </span>
          </div>

          <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {faculties.map((fac) => {
              const facExams = allExams.filter((e) => e.faculty_id === fac.id);
              const isSelected = selectedFaculty === fac.id;

              return (
                <button
                  key={fac.id}
                  onClick={() => {
                    setSelectedFaculty(isSelected ? 'all' : fac.id);
                    setSelectedProgram('all');
                    const el = document.getElementById('exam-table-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`card-academic p-4 text-right transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'hover:border-blue-300'
                  }`}
                >
                  <div>
                    <span className="chip bg-slate-100 text-slate-700 text-[10px] font-bold mb-2">
                      {fac.type || 'كلية جامعية'}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                      {fac.name_ar}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{fac.name_fr}</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-blue-600 font-bold">{facExams.length} امتحان</span>
                    <span className="text-slate-400 font-medium text-[11px]">
                      {isSelected ? 'إلغاء التحديد' : 'عرض في الجدول ←'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRIMARY SECTION: TABLE OF EXAMS BY FACULTY & PROGRAM */}
        <section id="exam-table-section" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200 mb-1">
                <Table className="h-3.5 w-3.5" />
                <span>الجدول المنظم للامتحانات</span>
              </div>
              <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-slate-900">
                جدول امتحانات {university.name_ar} مقسمة حسب الكلية والشعبة
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                تصفح وحمل جميع النماذج المعتمدة لجميع الفصول (S1 إلى S6) بصيغة PDF مع عناصر الإجابة والحلول الرسمية.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table className="h-3.5 w-3.5" />
                  <span>جدول منظم</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>بطاقات</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Filter Toolbar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
            {/* Faculty Tabs Bar */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block">اختر الكلية:</span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    setSelectedFaculty('all');
                    setSelectedProgram('all');
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedFaculty === 'all'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  جميع الكليات ({allExams.length})
                </button>
                {faculties.map((fac) => {
                  const count = allExams.filter((e) => e.faculty_id === fac.id).length;
                  return (
                    <button
                      key={fac.id}
                      onClick={() => {
                        setSelectedFaculty(fac.id);
                        setSelectedProgram('all');
                      }}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        selectedFaculty === fac.id
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {fac.name_ar} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Program Tabs (if specific programs exist) */}
            {availablePrograms.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 block">اختر الشعبة / المسلك:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedProgram('all')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedProgram === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    كافة الشعب
                  </button>
                  {availablePrograms.map((prog) => {
                    const count = allExams.filter((e) => e.program_id === prog.id).length;
                    return (
                      <button
                        key={prog.id}
                        onClick={() => setSelectedProgram(prog.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                          selectedProgram === prog.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {prog.name_ar} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search + Semester Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100 items-center">
              <div className="md:col-span-5 relative">
                <Search className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={examSearchQuery}
                  onChange={(e) => setExamSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المادة أو الأستاذ أو الوحدة..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-10 pl-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Semester buttons */}
              <div className="md:col-span-7 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 ml-1">الفصل:</span>
                {['all', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      selectedSemester === sem
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sem === 'all' ? 'الكل' : sem}
                  </button>
                ))}

                <label className="mr-auto inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <input
                    type="checkbox"
                    checked={onlyCorrected}
                    onChange={(e) => setOnlyCorrected(e.target.checked)}
                    className="rounded text-emerald-600 h-3.5 w-3.5"
                  />
                  <span>مع التصحيح فقط</span>
                </label>
              </div>
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                يظهر الآن <strong>{filteredExams.length}</strong> نموذج من أصل <strong>{allExams.length}</strong> امتحان متوفر
              </div>
              {(selectedFaculty !== 'all' || selectedProgram !== 'all' || selectedSemester !== 'all' || onlyCorrected || examSearchQuery) && (
                <button
                  onClick={() => {
                    setSelectedFaculty('all');
                    setSelectedProgram('all');
                    setSelectedSemester('all');
                    setSelectedSession('all');
                    setOnlyCorrected(false);
                    setExamSearchQuery('');
                  }}
                  className="font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  إعادة ضبط جميع الفلاتر ✕
                </button>
              )}
            </div>
          </div>

          {/* TABLE VIEW (Primary and Default) */}
          {viewMode === 'table' ? (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              {filteredExams.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="text-slate-600 font-bold text-sm">
                    لم نجد امتحانات تطابق خيارات التصفية الحالية.
                  </p>
                  <p className="text-xs text-slate-400">
                    جرب اختيار كلية أخرى أو إلغاء تصفية الفصول.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-3.5 px-3 sm:px-4 w-12 text-center">#</th>
                        <th className="py-3.5 px-3 sm:px-4">اسم الامتحان والمادة</th>
                        <th className="py-3.5 px-3 sm:px-4">الكلية</th>
                        <th className="py-3.5 px-3 sm:px-4">الشعبة</th>
                        <th className="py-3.5 px-2 sm:px-3 text-center">الفصل</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center">الدورة والسنة</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center">التصحيح</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center">التحميل والمعاينة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredExams.map((exam, idx) => {
                        const fac = exam._faculty;
                        const prog = exam._program;
                        const hasCorr = exam.has_correction || exam.correction_type !== 'sans_corrige';
                        const isOfficial = exam.correction_type === 'officiel';

                        return (
                          <tr
                            key={exam.id}
                            className="hover:bg-blue-50/40 transition-colors group"
                          >
                            <td className="py-3 px-3 sm:px-4 text-center text-slate-400 font-mono text-xs">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900">
                              <Link
                                to={`/examens/${exam.slug}`}
                                className="group-hover:text-blue-600 transition-colors flex items-center gap-1.5"
                              >
                                <span>{exam.title}</span>
                                <ChevronLeft className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 shrink-0" />
                              </Link>
                              {exam.description && (
                                <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5 max-w-md">
                                  {exam.description}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-slate-600 font-medium whitespace-nowrap">
                              {fac ? (
                                <span className="inline-block truncate max-w-[140px]" title={fac.name_ar}>
                                  {fac.name_ar}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-slate-600 font-medium whitespace-nowrap">
                              {prog ? (
                                <span className="inline-block truncate max-w-[140px]" title={prog.name_ar}>
                                  {prog.name_ar}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">
                              <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60">
                                {exam.semester}
                              </span>
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-center text-slate-600 whitespace-nowrap text-xs">
                              <div className="font-semibold text-slate-800">{exam.year}</div>
                              <div className="text-[11px] text-slate-400">
                                {exam.session === 'normale' ? 'دورة عادية' : 'استدراكية'}
                              </div>
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                              {isOfficial ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                  <span>تصحيح رسمي</span>
                                </span>
                              ) : hasCorr ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-[11px] font-bold">
                                  <Sparkles className="h-3 w-3 text-amber-600" />
                                  <span>حل مقترح</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">موضوع فقط</span>
                              )}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <Link
                                  to={`/examens/${exam.slug}`}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-xs font-bold transition-colors shadow-2xs"
                                  title="تحميل الامتحان بصيغة PDF"
                                >
                                  <Download className="h-3 w-3" />
                                  <span>تحميل PDF</span>
                                </Link>
                                <Link
                                  to={`/examens/${exam.slug}`}
                                  className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                  title="معاينة نموذج الامتحان"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* CARDS VIEW */
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </section>

        {/* FAQs Section */}
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              الأسئلة الشائعة حول امتحانات {university.name_ar} (FAQ)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            إجابات موثقة لمساعدة طلبة {university.name_ar} في التحضير للاختبارات وسحب الاستدعاءات.
          </p>

          <div className="space-y-3 pt-2">
            {universityFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-right flex items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-50 transition-colors font-bold text-sm text-slate-900 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
