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
  Award
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Faculty, Program } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO, { FAQItem } from '../components/SEO';

interface UniversityDetailPageProps {
  defaultUniSlug?: string;
}

const IBN_ZOHR_FAQS: FAQItem[] = [
  {
    question: 'متى ستكون وتاريخ امتحانات جامعة ابن زهر بأكادير في عام 2026؟',
    answer:
      'وفقاً للبرمجة الرسمية لجامعة ابن زهر والكليات التابعة لها (FSJES، FLSH، FSA): امتحانات الدورة الخريفية العادية تنطلق عادة في شهر يناير، وتليها الدورة الاستدراكية في فبراير. أما امتحانات الدورة الربيعية العادية للموسم الجامعي 2025/2026، فستتوقف الدراسة يوم السبت 16 ماي 2026، وتنطلق امتحانات الدورة العادية يوم الاثنين 01 يونيو 2026 لمختلف الأسداس (S2, S4, S6).',
  },
  {
    question: 'كيف يمكنني سحب وطبع استدعاء الامتحانات عبر منصة أبوجي (Apogee) الخاصة بجامعة ابن زهر؟',
    answer:
      'يتم استخراج استدعاء الامتحان إلكترونياً عبر المنصة الخاصة بالشؤون الطلابية لكل كلية (مثل منصة FSJESAM أو FSJES Agadir UIZ). الخطوات: 1) الولوج إلى فضاء الطالب بالكلية. 2) إدخال الرقم الوطني للطالب (رقم مسار CNE) ورقم التسجيل (Apogee). 3) الضغط على زر "طبع استدعاء الامتحان" وتحميله بصيغة PDF وطباعته على ورقة A4 واضحة تتضمن رقم القاعة ورقم الطاولة والبرمجة الزمنية.',
  },
  {
    question: 'ما هي الوثائق الإلزامية لاجتياز امتحانات كليات جامعة ابن زهر؟',
    answer:
      'يُمنع أي طالب من دخول قاعة الامتحان بدون إحضار الوثائق الرسمية الثلاث: 1) استدعاء الامتحان المطبوع من المنصة الإلكترونية. 2) بطاقة الطالب الجامعية أو شهادة التسجيل الأصلية الصالحة للموسم الجامعي الحالي. 3) البطاقة الوطنية للتعريف الإلكترونية (CNIE).',
  },
  {
    question: 'أين أجد نماذج امتحانات كلية القانون والاقتصاد ابن زهر مع عناصر الإجابة والتصحيح؟',
    answer:
      'توفر منصة ExamMaroc أكثر من 120 نموذج امتحان موثق لكليات جامعة ابن زهر (أكادير وأيت ملول) في شعب القانون باللغة العربية، الاقتصاد والتدبير، الدراسات الإنجليزية، والعلوم الدقيقة (S1 إلى S6) للدورتين العادية والاستدراكية مع عناصر الإجابة الرسمية والحلول النموذجية المقترحة بصيغة PDF مجانية بروابط مباشرة دون إعلانات منبثقة أو مؤقتات انتظار.',
  },
  {
    question: 'ما هي الضوابط والشروط داخل قاعات امتحانات جامعة ابن زهر وعقوبات إدخال الهاتف؟',
    answer:
      'تشدد جامعة ابن زهر على: 1) الوصول المبكر إلى قاعة الامتحان قبل 15 دقيقة على الأقل من بدء الاختبار. 2) الحظر المطلق والنهائي لإحضار الهاتف المحمول، الساعات الذكية، أو السماعات اللاسلكية؛ ومجرد حيازتها يعتبر محاولة غش موجبة للإحالة المباشرة على المجلس التأديبي وسحب النقطة والحرمان من اجتياز الامتحانات. 3) لا يُسمح لأي طالب بمغادرة قاعة الامتحان قبل مرور 30 دقيقة على انطلاقه.',
  },
  {
    question: 'ما هي كليات ومؤسسات جامعة ابن زهر المشمولة في المنصة؟',
    answer:
      'تشمل جامعة ابن زهر مؤسسات جامعية كبرى في جهة سوس ماسة والأقاليم الجنوبية: كلية العلوم القانونية والاقتصادية والاجتماعية بأكادير (FSJES)، كلية العلوم القانونية والاقتصادية بأيت ملول (FSJESAM)، كلية الآداب والعلوم الإنسانية بأكادير (FLSH)، كلية العلوم بأكادير (FSA)، كلية الشريعة بأيت ملول، كلية اللغات والفنون (FLAH)، الكلية متعددة التخصصات بتارودانت (FPT) وورزازات، والمدرسة الوطنية للعلوم التطبيقية (ENSA).',
  },
  {
    question: 'ما هو النظام الجديد (PACTE ESRI 2030) المعتمد في كليات ابن زهر؟',
    answer:
      'يعتمد النظام الجديد على هندسة بيداغوجية تركز على المهارات اللغوية (اللغة الإنجليزية والفرنسية)، والمهارات الرقمية الحياتية (Power Skills)، مع وحدات تخصصية دقيقة وتطبيق مستمر، حيث يتكون كل فصل من وحدات معرفية ووحدات لغوية ورقمية تخضع لتقييم المراقبة المستمرة والامتحانات النهائية الموحدة.',
  },
];

export default function UniversityDetailPage({ defaultUniSlug }: UniversityDetailPageProps) {
  const { uniSlug: paramUniSlug } = useParams<{ uniSlug: string }>();
  const uniSlug = defaultUniSlug || paramUniSlug;

  const [university, setUniversity] = useState<University | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [allExams, setAllExams] = useState<EnrichedExam[]>([]);
  const [loading, setLoading] = useState(true);

  // Ibn Zohr Filter States
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [onlyCorrected, setOnlyCorrected] = useState<boolean>(false);
  const [examSearchQuery, setExamSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!uniSlug) return;
    setLoading(true);
    const uni = StorageService.getUniversityBySlug(uniSlug);
    if (uni) {
      setUniversity(uni);
      setFaculties(StorageService.getFaculties(uni.id));
      setPrograms(StorageService.getPrograms(uni.id));
      // Fetch all exams belonging to this university
      const uniExams = StorageService.getExams({ university_id: uni.id });
      setAllExams(uniExams);
    } else {
      setUniversity(null);
    }
    setLoading(false);
  }, [uniSlug]);

  const isIbnZohr = university?.slug === 'ibn-zohr';

  // Filtered exams
  const filteredExams = useMemo(() => {
    let list = [...allExams];

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
      list = list.filter((e) => e.has_correction);
    }

    if (examSearchQuery.trim()) {
      const q = examSearchQuery.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e._subject && (e._subject.name_ar.toLowerCase().includes(q) || e._subject.name_fr.toLowerCase().includes(q))) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [allExams, selectedSemester, selectedProgram, selectedSession, onlyCorrected, examSearchQuery]);

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

  const pageTitle = isIbnZohr
    ? 'امتحانات جامعة ابن زهر 2026 مع التصحيح [PDF مجاناً] - كليات الحقوق والآداب والعلوم | ExamMaroc'
    : `نماذج امتحانات ${university.name_ar} مع التصحيح [PDF مجاناً] - كليات ${university.city_ar} | ExamMaroc`;

  const pageDescription = isIbnZohr
    ? 'أكبر بنك لنماذج امتحانات جامعة ابن زهر بأكادير وأيت ملول (FSJES, FLSH, FSA) مع عناصر الإجابة والتصحيح الرسمي [PDF مجاناً]. دليل سحب استدعاء الامتحان عبر Apogee وتواريخ الدورة العادية والاستدراكية.'
    : `تحميل ومشاهدة نماذج امتحانات ${university.name_ar} بـ${university.city_ar} لجميع الكليات (FSJES، العلوم، الآداب) من الفصل S1 إلى S6 بصيغة PDF مع عناصر الإجابة والتصحيح الرسمي للدورة العادية والاستدراكية مجاناً.`;

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
    url: `https://www.exammaroc.online/universites/${university.slug}`,
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={`https://www.exammaroc.online/universites/${university.slug}`}
        keywords={
          isIbnZohr
            ? [
                'امتحانات جامعة ابن زهر',
                'نماذج امتحانات جامعة ابن زهر',
                'امتحانات جامعة ابن زهر أكادير 2026',
                'امتحانات كلية القانون ابن زهر أكادير',
                'نماذج امتحانات كلية القانون ابن زهر اكادير',
                'امتحانات كلية الاقتصاد ابن زهر',
                'امتحانات كلية الآداب ابن زهر أكادير',
                'استدعاء الامتحانات جامعة ابن زهر',
                'طريقة الحصول على استدعاء الامتحانات ابن زهر',
                'Apogee جامعة ابن زهر',
                'فضاء الطالب جامعة ابن زهر',
                'FSJES Agadir',
                'FSJESAM UIZ',
                'FLSH Agadir',
                'تاريخ امتحانات جامعة ابن زهر أكادير 2026',
                'نتائج امتحانات جامعة ابن زهر أكادير',
                'AlloExam ابن زهر'
              ]
            : [
                `امتحانات ${university.name_ar}`,
                `نماذج امتحانات ${university.name_ar}`,
                `امتحانات كليات ${university.city_ar}`,
                'امتحانات مصححة PDF'
              ]
        }
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الجامعات', url: '/universites' },
          { name: university.name_ar, url: `/universites/${university.slug}` },
        ]}
        faqs={isIbnZohr ? IBN_ZOHR_FAQS : undefined}
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

        {/* Header Profile */}
        <header className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white p-5 sm:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-blue-500/20 text-blue-200 border border-blue-400/30 font-bold text-[11px] sm:text-xs">
                  مؤسسة جامعية مغربية معتمدة 🇲🇦
                </span>
                {isIbnZohr && (
                  <>
                    <span className="chip bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold text-[11px] sm:text-xs">
                      +{allExams.length} نموذج PDF متوفر
                    </span>
                    <span className="chip bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold text-[11px] sm:text-xs">
                      برمجة وتحديث 2026
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {isIbnZohr
                  ? 'امتحانات جامعة ابن زهر بأكادير والكليات التابعة لها'
                  : `امتحانات ${university.name_ar}`}
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 font-medium">
                {university.name_fr}
              </p>

              <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-300 font-semibold">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{university.city_ar} · {university.city} (سوس ماسة والأقاليم الجنوبية)</span>
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {isIbnZohr
                  ? 'دليل وبنك نماذج امتحانات كلية العلوم القانونية والاقتصادية والاجتماعية بأكادير وأيت ملول (FSJES / FSJESAM)، كلية الآداب والعلوم الإنسانية (FLSH)، وكلية العلوم (FSA) للفصول S1 إلى S6 بصيغة PDF مع عناصر الإجابة الرسمية وطريقة سحب استدعاء الامتحان عبر Apogee.'
                  : university.description}
              </p>
            </div>

            {/* Quick action buttons in hero */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              <a
                href="#exam-list"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all text-center"
              >
                <Download className="h-4 w-4" />
                <span>تحميل نماذج الامتحانات (+{allExams.length})</span>
              </a>

              {isIbnZohr && (
                <a
                  href="#convocation-guide"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all text-center"
                >
                  <Printer className="h-4 w-4 text-emerald-400" />
                  <span>دليل استدعاء الامتحان Apogee</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Specialized Google AI Overview / Featured Snippet Box for Ibn Zohr */}
        {isIbnZohr && (
          <section id="convocation-guide" className="rounded-2xl sm:rounded-3xl border-2 border-blue-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-2xl font-black text-slate-900">
                  دليل امتحانات جامعة ابن زهر 2026: الاستدعاء، الشروط، والبرمجة
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  معلومات موثقة وشاملة لطلبة كليات جامعة ابن زهر (أكادير وأيت ملول)
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Convocation Apogee */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <Printer className="h-4 w-4" />
                  <span>طريقة سحب الاستدعاء</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يتم استخراج استدعاء الامتحانات عبر المنصة الإلكترونية للشؤون الطلابية الخاصة بالكلية (مثل <strong>FSJESAM UIZ</strong> أو <strong>FSJES Agadir</strong>) بإدخال <strong>الرقم الوطني (مسار CNE)</strong> ورقم التسجيل <strong>(Apogee)</strong> وطباعته على ورقة A4.
                </p>
              </div>

              {/* Card 2: Mandatory Documents */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <FileCheck className="h-4 w-4" />
                  <span>الوثائق الإلزامية بالقاعة</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>استدعاء الامتحان المطبوع (A4)</li>
                  <li>بطاقة الطالب أو شهادة التسجيل الصالحة</li>
                  <li>بطاقة التعريف الوطنية (CNIE)</li>
                </ul>
              </div>

              {/* Card 3: Strict Rules */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <ShieldAlert className="h-4 w-4" />
                  <span>ضوابط قاعات الامتحانات</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  الحضور قبل <strong>15 دقيقة</strong> على الأقل. <strong>يُمنع منعاً كلياً</strong> إحضار أو استخدام الهاتف أو الساعات الذكية (تحت طائلة المجلس التأديبي). لا مغادرة قبل انقضاء <strong>30 دقيقة</strong> الأولى.
                </p>
              </div>

              {/* Card 4: Dates & Calendar */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>برمجة الامتحانات 2026</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  الدورة الخريفية: يناير وفبراير 2026. الدورة الربيعية العادية: توقف الدراسة <strong>16 ماي 2026</strong>، وانطلاق الامتحانات ابتداءً من <strong>01 يونيو 2026</strong> لمختلف الأسداس.
                </p>
              </div>
            </div>

            {/* Why ExamMaroc Beats Competitors (AlloExam Crusher) */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 p-4 sm:p-5 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-600 text-white text-[10px] font-black">
                    ميزة حصرية
                  </span>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                    لماذا يتفوق ExamMaroc على AlloExam والمواقع الطلابية الأخرى؟
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تحميل فوري ومباشر دون عد تنازلي أو إعلانات منبثقة مزعجة، عناصر الإجابة والتصحيح الرسمي معتمدة، تصنيف حسب الفصل والدورة، وسرعة فائقة على الهواتف الذكية.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="chip bg-white border border-emerald-200 text-emerald-800 font-bold text-xs py-1.5 px-3 shadow-2xs">
                  ✅ 100% مجاني
                </span>
                <span className="chip bg-white border border-blue-200 text-blue-800 font-bold text-xs py-1.5 px-3 shadow-2xs">
                  ⚡ تحميل فوري مباشر
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Popular Tracks & Streams Quick Links */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>أهم شعب ومسالك {university.name_ar}</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              اختر الشعبة للتصفح الفوري
            </span>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((prog) => {
              const progExams = allExams.filter((e) => e.program_id === prog.id);
              const isSelected = selectedProgram === prog.id;

              return (
                <button
                  key={prog.id}
                  onClick={() => {
                    setSelectedProgram(isSelected ? 'all' : prog.id);
                    const el = document.getElementById('exam-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`card-academic p-4 text-right transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'hover:border-blue-300'
                  }`}
                >
                  <div>
                    <span className="chip bg-slate-100 text-slate-700 text-[10px] font-bold mb-2">
                      {prog.cycle}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                      {prog.name_ar}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{prog.name_fr}</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-blue-600 font-bold">{progExams.length} امتحان</span>
                    <span className="text-slate-400 font-medium">
                      {isSelected ? 'إلغاء التحديد' : 'تصفية النماذج ←'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Faculties List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <School className="h-5 w-5 text-blue-600" />
              <span>الكليات والمؤسسات التابعة</span>
            </h2>
            <span className="text-xs text-slate-500">
              {faculties.length} مؤسسة جامعية
            </span>
          </div>

          <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculties.map((fac) => {
              const facPrograms = programs.filter((p) => p.faculty_id === fac.id);
              return (
                <div key={fac.id} className="card-academic p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
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
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium block mb-1">
                        الشعب المتوفرة:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {facPrograms.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedProgram(p.id);
                              const el = document.getElementById('exam-list');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="chip bg-blue-50 text-blue-700 text-[11px] hover:bg-blue-100 cursor-pointer"
                          >
                            {p.name_ar}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <AdSlot />

        {/* Interactive Multi-Filter Exam Hub */}
        <section id="exam-list" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>
                  {isIbnZohr
                    ? 'نماذج امتحانات جامعة ابن زهر (أكادير وأيت ملول)'
                    : `نماذج امتحانات ${university.name_ar}`}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                تصفية ذكية حسب الفصل (S1 إلى S6)، الشعبة، الدورة، ونماذج التصحيح الرسمي.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>عرض <strong>{filteredExams.length}</strong> من أصل <strong>{allExams.length}</strong> امتحان</span>
              {(selectedSemester !== 'all' || selectedProgram !== 'all' || selectedSession !== 'all' || onlyCorrected || examSearchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSemester('all');
                    setSelectedProgram('all');
                    setSelectedSession('all');
                    setOnlyCorrected(false);
                    setExamSearchQuery('');
                  }}
                  className="chip bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer text-[11px]"
                >
                  إعادة ضبط الفلاتر ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar Controls */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={examSearchQuery}
                onChange={(e) => setExamSearchQuery(e.target.value)}
                placeholder="ابحث داخل امتحانات الجامعة (اسم المادة، الأستاذ، أو الوحدة)..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 sm:py-2.5 pr-10 pl-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Semester Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-bold text-slate-500 ml-1">الفصل الدراسي:</span>
              {['all', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`chip text-xs font-bold transition-colors cursor-pointer px-3 py-1 ${
                    selectedSemester === sem
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'
                  }`}
                >
                  {sem === 'all' ? 'جميع الفصول' : sem}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Session & Only Corrected */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-500">الدورة:</span>
                <button
                  onClick={() => setSelectedSession('all')}
                  className={`chip text-[11px] font-semibold cursor-pointer ${
                    selectedSession === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedSession('normale')}
                  className={`chip text-[11px] font-semibold cursor-pointer ${
                    selectedSession === 'normale'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  الدورة العادية
                </button>
                <button
                  onClick={() => setSelectedSession('rattrapage')}
                  className={`chip text-[11px] font-semibold cursor-pointer ${
                    selectedSession === 'rattrapage'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  الدورة الاستدراكية
                </button>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyCorrected}
                  onChange={(e) => setOnlyCorrected(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  النماذج المصححة فقط (مع الحل)
                </span>
              </label>
            </div>
          </div>

          {/* Exam Cards Grid */}
          {filteredExams.length === 0 ? (
            <div className="card-academic p-10 text-center space-y-3">
              <p className="text-slate-500 text-sm">
                لم يتم العثور على أي نماذج امتحانات مطابقة لمعايير البحث الحالية.
              </p>
              <button
                onClick={() => {
                  setSelectedSemester('all');
                  setSelectedProgram('all');
                  setSelectedSession('all');
                  setOnlyCorrected(false);
                  setExamSearchQuery('');
                }}
                className="chip bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs px-4 py-2 font-bold cursor-pointer"
              >
                عرض جميع امتحانات {university.name_ar}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </section>

        {/* People Also Ask / FAQ Section for Ibn Zohr (Rich Result Engine) */}
        {isIbnZohr && (
          <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
                الأسئلة الشائعة حول امتحانات جامعة ابن زهر أكادير (FAQ)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              إجابات معتمدة على أكثر الأسئلة بحثاً من قِبل طلبة جامعة ابن زهر وكلياتها.
            </p>

            <div className="space-y-3 pt-2">
              {IBN_ZOHR_FAQS.map((faq, idx) => {
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
        )}
      </div>
    </>
  );
}
