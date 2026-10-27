import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Download,
  Calendar,
  School,
  ArrowRight,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import Breadcrumbs, { BreadcrumbItem } from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import SEO from '../components/SEO';

const SPECIALTIES = [
  { id: 'all', label: 'جميع التخصصات' },
  { id: 'droit', label: 'القانون والعلوم القانونية' },
  { id: 'eco', label: 'الاقتصاد والتدبير (Économie & Gestion)' },
  { id: 'sciences', label: 'العلوم والتقنيات (Sciences & Tech)' },
  { id: 'lettres', label: 'الآداب والعلوم الإنسانية' },
];

export default function MasterConcoursPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'الرئيسية', to: '/' },
    { label: 'امتحانات الماستر بالمغرب' },
  ];

  const allExams = useMemo(() => StorageService.getExams(), []);
  const universities = useMemo(() => StorageService.getUniversities(), []);

  // Filter master concours exams
  const masterExams = useMemo(() => {
    return allExams.filter((exam) => {
      const isMaster =
        exam.semester === 'Master' ||
        exam.title.toLowerCase().includes('master') ||
        exam.title.toLowerCase().includes('concours') ||
        exam.title.includes('ماستر') ||
        exam.title.includes('مباراة ولوج') ||
        exam.tags?.some((t) => t.toLowerCase().includes('master') || t.includes('ماستر'));

      if (!isMaster) return false;

      if (selectedUni && exam.university_id !== selectedUni) return false;

      if (selectedSpecialty === 'droit') {
        const isDroit =
          exam.title.includes('قانون') ||
          exam.title.includes('Droit') ||
          exam.tags?.some((t) => t.includes('قانون') || t.includes('حقوق'));
        if (!isDroit) return false;
      } else if (selectedSpecialty === 'eco') {
        const isEco =
          exam.title.includes('اقتصاد') ||
          exam.title.includes('تدبير') ||
          exam.title.toLowerCase().includes('gestion') ||
          exam.title.toLowerCase().includes('finance') ||
          exam.title.toLowerCase().includes('comptabilite');
        if (!isEco) return false;
      } else if (selectedSpecialty === 'sciences') {
        const isSci =
          exam.title.includes('علوم') ||
          exam.title.toLowerCase().includes('informatique') ||
          exam.title.toLowerCase().includes('data') ||
          exam.title.toLowerCase().includes('math');
        if (!isSci) return false;
      } else if (selectedSpecialty === 'lettres') {
        const isLettres =
          exam.title.includes('آداب') ||
          exam.title.toLowerCase().includes('english') ||
          exam.title.includes('جغرافيا');
        if (!isLettres) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          exam.title.toLowerCase().includes(q) ||
          exam.description?.toLowerCase().includes(q) ||
          (exam._university?.name_ar || '').includes(searchQuery)
        );
      }

      return true;
    });
  }, [allExams, selectedSpecialty, selectedUni, searchQuery]);

  const faqs = [
    {
      question: 'كيف يتم التحضير لمباريات ولوج الماستر بالجامعات المغربية؟',
      answer: 'التحضير لمباريات الماستر يتطلب: 1) مراجعة شاملة لدروس سلك الإجازة (الفصول S1 إلى S6) خصوصاً المواد الأساسية للتخصص، 2) التدرب على نماذج مواضيع السنوات السابقة (Épreuves écrites)، 3) ضبط منهجية تحرير المقال القانوني أو التحليل الاقتصادي، 4) التحضير للمقابلة الشفوية ومناقشة مشروع نهاية الدراسة (PFE).',
    },
    {
      question: 'هل امتحانات الماستر المنشورة في المنصة مرفقة بالتصحيح وعناصر الإجابة؟',
      answer: 'نعم، العديد من النماذج مرفقة بعناصر الإجابة وسلم التنقيط أو حلول مقترحة من أساتذة وطلبة باحثين لتوضيح محاور الإجابة النموذجية.',
    },
    {
      question: 'ما هي معايير الانتقاء الأولي (Présélection) في ماسترات كليات الحقوق والاقتصاد؟',
      answer: 'تعتمد أغلب الكليات (مثل FSJES السويسي، أكدال، عين الشق، مراكش، أكادير) على دراسة الملف الأكاديمي: معدل الإجازة العام، عدد الميزات (Mentions)، وسنوات الحصول على الإجازة (دون تكرار)، يليه الاختبار الكتابي للمؤهلين.',
    },
    {
      question: 'هل يمكن تحميل نماذج مباريات الماستر بصيغة PDF مجاناً؟',
      answer: 'نعم، جميع النماذج على ExamMaroc متاحة للتحميل المباشر والمجاني بصيغة PDF قابلة للطباعة دون اشتراك أو تسجيل.',
    },
  ];

  const canonicalUrl = 'https://www.exammaroc.online/examens-master-maroc';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'نماذج امتحانات مباريات الماستر بالجامعات المغربية مع التصحيح PDF',
      description: 'أرشيف شامل لجميع نماذج امتحانات مباريات ولوج الماستر بمختلف الكليات المغربية FSJES وFLSH وFS بصيغة PDF مجاناً.',
      url: canonicalUrl,
      about: {
        '@type': 'EducationalOccupationalCredential',
        name: 'Diplôme de Master au Maroc',
        credentialCategory: 'degree',
        educationalLevel: 'Postgraduate / Bac+5',
      },
    },
  ];

  return (
    <>
      <SEO
        title="نماذج امتحانات ولوج الماستر بالجامعات المغربية مع التصحيح PDF | ExamMaroc"
        description="تحميل نماذج امتحانات مباريات ولوج الماستر بالجامعات المغربية (FSJES، FLSH، FS) بصيغة PDF مجاناً مع التصحيحات النموذجية ومنهجية اجتياز الاختبارات الكتابية والشفوية."
        canonical={canonicalUrl}
        keywords={[
          'نماذج امتحانات الماستر بالمغرب',
          'مباريات الماستر القانون الخاص',
          'مباريات ماستر الاقتصاد والتدبير',
          'concours master maroc pdf',
          'امتحانات ماستر جامعة محمد الخامس',
          'امتحانات ماستر جامعة ابن زهر',
          'امتحانات ماستر جامعة الحسن الثاني',
          'منهجية مباراة الماستر',
        ]}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.to || '/examens-master-maroc',
        }))}
        faqs={faqs}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-6 sm:py-10">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Banner */}
        <section className="mt-4 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 mb-4">
              <GraduationCap className="h-4 w-4 text-blue-400" />
              <span>أرشيف مباريات سلك الماستر والماستر المتخصص</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              نماذج امتحانات ولوج <span className="text-blue-400">الماستر بالجامعات المغربية</span> مع عناصر الإجابة
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              تجميعة رسمية ومحدثة لمواضيع الاختبارات الكتابية لمباريات سلك الماستر بكليات العلوم القانونية والاقتصادية والآداب والعلوم (FSJES, FLSH, FS) بصيغة PDF جاهزة للتحميل والطباعة.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>نماذج مرفقة بالتصحيح المعتمد</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>تغطية لأهم كليات المملكة</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>تحميل مباشر ومجاني 100%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Filters Toolbar */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن ماستر معين (مثال: قانون الأعمال، المالية، الذكاء الاصطناعي...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-10 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* University Selector */}
            <div className="w-full lg:w-72">
              <select
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
                aria-label="اختر الجامعة"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">جميع الجامعات المغربية</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name_ar} ({uni.city_ar})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialty Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-500 ml-2">الشعبة:</span>
            {SPECIALTIES.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedSpecialty === spec.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </section>

        {/* Exams Grid */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>النماذج المتوفرة ({masterExams.length} امتحان)</span>
            </h2>
            <Link
              to="/examens"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>تصفح كافة امتحانات المنصة</span>
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          {masterExams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {masterExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-3 font-heading font-bold text-base text-slate-800">
                لم نجد نماذج تطابق بحثك حالياً
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                جرب تغيير خيارات التصفية أو اختيار تخصص آخر.
              </p>
              <button
                onClick={() => {
                  setSelectedSpecialty('all');
                  setSelectedUni('');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                إعادة ضبط البحث
              </button>
            </div>
          )}
        </section>

        {/* Master Preparation Guide */}
        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Award className="h-6 w-6 text-amber-500" />
              <span>دليل التفوق في مباريات ولوج الماستر بالمغرب</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              اجتياز مباريات الماستر بنجاح يتطلب الإلمام بالمنهجية الأكاديمية والقدرة على التحليل والتركيب بدلاً من الحفظ السطحي. إليك أهم النصائح المعتمدة:
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-xs text-white">1</span>
                <h3 className="mt-2.5 font-heading font-bold text-sm text-slate-900">ضبط المنهجية القانونية/التحليلية</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  مقدمة محكمة تتضمن تأطير الموضوع، تحديد الإشكالية الجوهرية، وإعلان خطة ثنائية واضحة (مبحثين/مطلبين).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 font-bold text-xs text-white">2</span>
                <h3 className="mt-2.5 font-heading font-bold text-sm text-slate-900">مواكبة المستجدات التشريعية والاقتصادية</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  الاطلاع على القوانين الصادرة حديثاً، القرارات القضائية لمحكمة النقض، والتقارير الاقتصادية السنوية.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 font-bold text-xs text-white">3</span>
                <h3 className="mt-2.5 font-heading font-bold text-sm text-slate-900">الاستعداد للاختبار الشفوي (Entretien)</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  إتقان الدفاع عن بحث الإجازة (PFE)، توضيح دوافع اختيار الماستر، والقدرة على النقاش باللغتين العربية والفرنسية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>الأسئلة الشائعة حول مباريات الماستر بالمغرب</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-right font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/40 pt-3">
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
