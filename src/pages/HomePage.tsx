import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  School,
  BookOpen,
  ArrowLeft,
  Zap,
  Layers,
  ShieldCheck,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Subject } from '../data/initialData';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const POPULAR_SEARCHES = [
  'امتحانات جامعة ابن زهر',
  'امتحانات كلية القانون ابن زهر',
  'FSJES Agadir ابن زهر',
  'استدعاء امتحانات ابن زهر Apogee',
  'امتحانات English S1',
  'القانون الجنائي S2',
  'Reading Comprehension S1',
  'Microéconomie 1 S1',
  'Grammar 1 S1',
  'المدخل لدراسة القانون S1',
  'Comptabilité Générale S1',
  'FLSH Agadir'
];

const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

const FAQS = [
  {
    question: 'كيف يمكنني تحميل نماذج امتحانات الجامعات المغربية بصيغة PDF؟',
    answer: 'يمكنك تصفح الامتحانات حسب جامعتك وكليتك وشعبتك أو البحث المباشر في شريط البحث. كل نموذج امتحان يتوفر على زر تحميل PDF مباشر مجاني بروابط سحابية موثقة دون الحاجة لإنشاء حساب أو دفع أي رسوم.',
  },
  {
    question: 'هل تتوفر امتحانات مع التصحيح وعناصر الإجابة الرسمية؟',
    answer: 'نعم! تخصص المنصة قسماً كاملاً للامتحانات المصححة (Avec Corrigé) يميّز بين النماذج المرفقة بالتصحيح الرسمي وسلم التنقيط المعتمد من الأساتذة، والنماذج المرفقة بحلول نموذجية مقترحة ومفصلة.',
  },
  {
    question: 'هل تتوفر امتحانات الدورة العادية والاستدراكية (Rattrapage)؟',
    answer: 'نعم، تضم المنصة نماذج امتحانات الدورة العادية (Session Normale) ودورة الاستدراك (Session Rattrapage) لمختلف الفصول من الفصل الأول S1 حتى الفصل السادس S6 مع تواريخ وتفاصيل كل دورة للأعوام 2021 إلى 2024.',
  },
  {
    question: 'ما هي الجامعات الـ 12 المشمولة في المنصة؟',
    answer: 'تغطي المنصة جميع الجامعات المغربية العمومية الـ 12: جامعة ابن زهر، جامعة محمد الخامس، جامعة الحسن الثاني، جامعة القاضي عياض، جامعة سيدي محمد بن عبد الله، جامعة مولاي إسماعيل، جامعة محمد الأول، جامعة عبد المالك السعدي، جامعة ابن طفيل، جامعة شعيب الدكالي، جامعة السلطان مولاي سليمان، وجامعة الحسن الأول، مع مختلف كلياتها (FSJES, FS, FLSH, FST).',
  },
  {
    question: 'ماذا أفعل إذا واجهت رابط تحميل معطل أو نموذجاً ناقصاً؟',
    answer: 'كل صفحة امتحان تشتمل على زر "الإبلاغ عن رابط معطل أو مشكلة". بمجرد الضغط عليه يمكنك إرسال الملاحظة ليقوم فريق التدقيق والتحقق بفحص الرابط وتحديثه فوراً.',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [latestExams, setLatestExams] = useState<EnrichedExam[]>([]);
  const [correctedSample, setCorrectedSample] = useState<EnrichedExam[]>([]);
  const [englishExams, setEnglishExams] = useState<EnrichedExam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState({
    universities: 12,
    faculties: 34,
    exams: 703,
    correctedExams: 450,
    downloads: 12400
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUniversities(StorageService.getUniversities());
    setLatestExams(StorageService.getExams({ limit: 6 }));
    setCorrectedSample(StorageService.getCorrectedExams({ limit: 6 }));
    
    // Load English S1 exams directly for instant access
    const eng = StorageService.getExams({ semester: 'S1' })
      .filter((e) => 
        e.tags?.some((t) => t.toLowerCase().includes('english') || t.toLowerCase().includes('reading') || t.toLowerCase().includes('grammar') || t.toLowerCase().includes('writing')) ||
        e.title.toLowerCase().includes('english') ||
        e.title.toLowerCase().includes('reading') ||
        e.title.toLowerCase().includes('grammar')
      )
      .slice(0, 6);
    setEnglishExams(eng);

    setSubjects(StorageService.getSubjects().slice(0, 16));
    setStats(StorageService.getStats());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      <SEO
        title="ExamMaroc - جميع نماذج امتحانات الجامعات المغربية 2026 مع التصحيح [PDF مجاناً]"
        description="أكبر بنك لنماذج امتحانات الجامعات المغربية الـ 12 مع عناصر الإجابة والتصحيح الرسمي [PDF مجاناً]. ابحث وحمّل امتحانات S1 إلى S6 لجميع كليات الحقوق والاقتصاد والعلوم والآداب للدورة العادية والاستدراكية."
        canonical="https://www.exammaroc.online/"
        keywords={[
          'امتحانات جامعية المغرب',
          'نماذج امتحانات الجامعات المغربية',
          'امتحانات مصححة المغرب',
          'امتحانات FSJES',
          'امتحانات كلية الحقوق المغرب',
          'امتحانات كلية العلوم المغرب',
          'امتحانات القانون باللغة العربية',
          'امتحانات الاقتصاد والتدبير',
          'امتحانات S1 S2 S3 S4 S5 S6',
          'امتحانات الدورة العادية والاستدراكية',
          'تحميل امتحانات المغرب PDF',
          'جامعة ابن زهر أكادير',
          'جامعة محمد الخامس الرباط',
          'جامعة الحسن الثاني الدار البيضاء',
          'جامعة القاضي عياض مراكش',
          'جامعة سيدي محمد بن عبد الله فاس',
          'جامعة مولاي إسماعيل مكناس',
          'جامعة محمد الأول وجدة',
          'جامعة عبد المالك السعدي طنجة تطوان',
          'جامعة ابن طفيل القنيطرة',
          'جامعة شعيب الدكالي الجديدة',
          'جامعة السلطان مولاي سليمان بني ملال',
          'جامعة الحسن الأول سطات',
          'examens universitaires maroc pdf',
          'examens corrigés fsjes maroc'
        ]}
        faqs={FAQS}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ExamMaroc',
          url: 'https://www.exammaroc.online',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.exammaroc.online/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white">
        <div className="container-academic py-8 sm:py-16 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 chip bg-blue-100/90 text-blue-800 font-bold mb-3 sm:mb-5 px-3 py-1 sm:px-3.5 sm:py-1.5 shadow-2xs text-[11px] sm:text-xs">
            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>المنصة الأكاديمية للامتحانات الجامعية بالمغرب 🇲🇦</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-tight">
            جميع نماذج امتحانات الجامعات المغربية في مكان واحد
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            بنك موثّق يضم أكثر من <strong>{stats.exams}</strong> نموذج امتحان لكليات الحقوق والاقتصاد والعلوم والآداب، منظمة حسب الجامعة والكلية والفصل الدراسي، بصيغة PDF مجانية مع عناصر الإجابة والتصحيح.
          </p>

          {/* Central Search Bar */}
          <form onSubmit={handleSearch} className="mt-5 sm:mt-8 mx-auto max-w-2xl">
            <div className="relative group">
              <Search className="pointer-events-none absolute right-3.5 sm:right-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                placeholder="ابحث باسم المادة، الكلية، الشعبة، أو الأستاذ..."
                className="w-full rounded-xl sm:rounded-2xl border border-slate-300 bg-white py-3 sm:py-4 pr-10 sm:pr-12 pl-20 sm:pl-4 text-xs sm:text-base text-slate-900 shadow-2xs outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
              />
              <button
                type="submit"
                className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 rounded-lg sm:rounded-xl bg-blue-600 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                بحث
              </button>
            </div>
          </form>

          {/* Popular searches tags */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs text-slate-500 font-bold">الأكثر بحثًا:</span>
            {POPULAR_SEARCHES.map((query) => (
              <button
                key={query}
                onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                className="chip border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer text-[11px] sm:text-xs px-2.5 py-1"
              >
                {query}
              </button>
            ))}
          </div>

          {/* Key Statistics Bar */}
          <div className="mt-6 sm:mt-10 pt-5 sm:pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center">
            <div className="p-2.5 sm:p-3 bg-white/70 rounded-xl sm:bg-transparent border border-slate-200/60 sm:border-0 shadow-2xs sm:shadow-none">
              <span className="block font-heading text-xl sm:text-3xl font-black text-blue-600">
                12
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">جامعة مغربية</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-white/70 rounded-xl sm:bg-transparent border border-slate-200/60 sm:border-0 shadow-2xs sm:shadow-none">
              <span className="block font-heading text-xl sm:text-3xl font-black text-purple-600">
                {stats.faculties}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">كلية ومؤسسة</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-white/70 rounded-xl sm:bg-transparent border border-slate-200/60 sm:border-0 shadow-2xs sm:shadow-none">
              <span className="block font-heading text-xl sm:text-3xl font-black text-slate-900">
                +{stats.exams}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">نموذج PDF</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-white/70 rounded-xl sm:bg-transparent border border-slate-200/60 sm:border-0 shadow-2xs sm:shadow-none">
              <span className="block font-heading text-xl sm:text-3xl font-black text-emerald-600">
                +{stats.correctedExams}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">نموذج مصحح</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-academic py-6 sm:py-10 space-y-8 sm:space-y-14">
        {/* Fast Browse by Semester (S1 - S6) - Instant Phone Access */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-heading text-base sm:text-xl font-bold text-slate-900">
              تصفح سريع حسب الفصل الدراسي (S1 - S6)
            </h2>
            <Link
              to="/examens"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
            >
              جميع الفصول
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {SEMESTERS.map((sem) => (
              <Link
                key={sem}
                to={`/examens?semester=${sem}`}
                className="card-academic py-2.5 sm:py-4 px-2 text-center hover:border-blue-500 hover:bg-blue-50/40 transition-all group shadow-2xs active:scale-95"
              >
                <span className="font-heading text-base sm:text-2xl font-black text-blue-600 group-hover:scale-105 inline-block transition-transform">
                  {sem}
                </span>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  الفصل {sem.replace('S', '')}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Dedicated High-Traffic Niche: English Studies S1 Section */}
        {englishExams.length > 0 && (
          <section className="rounded-2xl sm:rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white p-4 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="chip bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-0.5 text-[11px] sm:text-xs gap-1">
                    <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                    شعبة الدراسات الإنجليزية · English Studies S1
                  </span>
                  <span className="chip bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold">
                    13 نموذج موثق
                  </span>
                </div>
                <h2 className="font-heading text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                  امتحانات شعبة الدراسات الإنجليزية الفصل الأول (English S1)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  نماذج حقيقية لكليات الآداب والعلوم الإنسانية (فاس، الدار البيضاء، مراكش، أكادير، مكناس...) لمواد: Reading Comprehension, Grammar 1, Paragraph Writing, Spoken English, Study Skills.
                </p>
              </div>

              <Link
                to="/search?q=English+S1"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline bg-white/80 border border-blue-200 px-3.5 py-2 rounded-xl"
              >
                <span>عرض جميع نماذج English S1</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Quick module tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px]">
              <span className="text-slate-500 font-bold ml-1">مواد الفصل الأول:</span>
              {[
                'Reading Comprehension and Précis 1',
                'Grammar 1',
                'Paragraph Writing',
                'Guided Reading',
                'Spoken English',
                'Study Skills'
              ].map((subTitle) => (
                <Link
                  key={subTitle}
                  to={`/search?q=${encodeURIComponent(subTitle)}`}
                  className="rounded-lg bg-white border border-blue-200/80 px-2.5 py-1 text-blue-800 font-semibold hover:bg-blue-600 hover:text-white transition-colors shadow-2xs"
                >
                  {subTitle}
                </Link>
              ))}
            </div>

            <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {englishExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </section>
        )}

        {/* Featured High-Authority Hub: Université Ibn Zohr Agadir (UIZ) */}
        <section className="rounded-2xl sm:rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="chip bg-blue-500/20 text-blue-200 border border-blue-400/30 font-bold text-[11px] sm:text-xs">
                    جامعة ابن زهر · UIZ Agadir 🇲🇦
                  </span>
                  <span className="chip bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold text-[11px] sm:text-xs">
                    +121 نموذج PDF متوفر
                  </span>
                  <span className="chip bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold text-[11px] sm:text-xs">
                    دليل استدعاء Apogee 2026
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-3xl font-black text-white leading-tight">
                  امتحانات جامعة ابن زهر بأكادير والكليات التابعة لها (FSJES · FLSH · FSA)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  أكبر أرشيف لنماذج امتحانات كلية العلوم القانونية والاقتصادية بأكادير وأيت ملول، كلية الآداب، وكلية العلوم مع عناصر الإجابة، تواريخ الدورة العادية والاستدراكية، ودليل طبع الاستدعاء عبر أبوجي.
                </p>
              </div>

              <Link
                to="/universites/ibn-zohr"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all shadow-md"
              >
                <span>دخول قسم امتحانات ابن زهر</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Filter links for Ibn Zohr */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">أقسام ابن زهر السريعة:</span>
              <Link
                to="/universites/ibn-zohr"
                className="chip bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
              >
                ⚖️ كلية القانون بالعربية (S1-S6)
              </Link>
              <Link
                to="/universites/ibn-zohr"
                className="chip bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
              >
                📊 كلية الاقتصاد والتدبير (FSJES)
              </Link>
              <Link
                to="/universites/ibn-zohr"
                className="chip bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
              >
                🔬 كلية العلوم بأكادير (FSA)
              </Link>
              <Link
                to="/universites/ibn-zohr"
                className="chip bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
              >
                📚 كلية الآداب والدراسات الإنجليزية
              </Link>
              <Link
                to="/universites/ibn-zohr#convocation-guide"
                className="chip bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30"
              >
                🖨️ دليل استدعاء الامتحانات Apogee
              </Link>
            </div>
          </div>
        </section>

        {/* Banner: Corrected Exams Feature */}
        <section className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-4 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div className="space-y-1.5 sm:space-y-2 text-right">
            <span className="chip bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 gap-1 text-[11px] sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              جديد: قسم الامتحانات المصححة
            </span>
            <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
              تصفح مئات نماذج الامتحانات المرفقة بعناصر الإجابة الرسمية
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              وفّر وقتك في البحث واطلع مباشرة على النماذج التي تتضمن حلولاً نموذجية وسلم تنقيط معتمد للمساعدة في فهم طريقة الإجابة الصحيحة.
            </p>
          </div>
          <Link
            to="/examens-corriges"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <span>دخول قسم الامتحانات المصححة</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </section>

        {/* Sample Corrected Exams */}
        {correctedSample.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
                    نماذج امتحانات مختارة مع التصحيح
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  نماذج امتحانات حديثة تتضمن عناصر الإجابة والحلول المعتمدة.
                </p>
              </div>
              <Link
                to="/examens-corriges"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                <span>عرض الكل</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {correctedSample.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </section>
        )}

        {/* Ad Slot */}
        <AdSlot />

        {/* Latest Exams */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
                أحدث نماذج الامتحانات المضافة
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                نماذج امتحانات جامعية حديثة تمت إضافتها وتوثيق روابطها.
              </p>
            </div>
            <Link
              to="/latest-exams"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>

        {/* Browse by the 12 Universities (Compact 2-col mobile grid) */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
                تصفح حسب الجامعة المغربية (12 جامعة)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                اختر جامعتك للوصول إلى كلياتها وشعبها وامتحاناتها السابقة.
              </p>
            </div>
            <Link
              to="/universites"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>الدليل الكامل</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                to={`/universites/${uni.slug}`}
                className="card-academic p-3 sm:p-5 flex items-start gap-2.5 sm:gap-4 hover:border-blue-400 group transition-all"
              >
                <span className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                  <School className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                  <h3 className="font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs sm:text-base truncate">
                    {uni.name_ar}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate hidden xs:block">
                    {uni.name_fr}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                    {uni.city_ar}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Most Searched Subjects */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              أكثر الوحدات والمواد بحثًا
            </h2>
            <Link
              to="/subjects"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
            >
              جميع المواد ({subjects.length})
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/search?q=${encodeURIComponent(sub.name_ar)}`}
                className="card-academic px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm text-slate-800">
                  {sub.name_ar}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                  · {sub.name_fr}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Why ExamMaroc? */}
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-12 shadow-sm">
          <h2 className="font-heading text-xl sm:text-3xl font-bold text-slate-900 text-center">
            مميزات منصة ExamMaroc للطلاب الجامعيين
          </h2>
          <p className="text-center text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            صُممت المنصة لتلبية الاحتياجات الأكاديمية للطلبة في مختلف الكليات والجامعات المغربية.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: 'تحميل مباشر وسريع',
                desc: 'روابط مباشرة لمعاينة وتحميل ملفات PDF دون إعلانات منبثقة مزعجة أو اشتراكات.',
              },
              {
                icon: Layers,
                title: 'هيكلة دقيقة للفصول',
                desc: 'تصنيف أكاديمي منظم: الجامعة ← الكلية ← الشعبة ← الفصل S1-S6 ← المادة.',
              },
              {
                icon: CheckCircle2,
                title: 'عناصر الإجابة والتصحيح',
                desc: 'تمييز النماذج التي تتضمن حلولاً معتمدة من الأساتذة أو مقترحات نموذجية مفصلة.',
              },
              {
                icon: ShieldCheck,
                title: 'روابط موثوقة ومفحوصة',
                desc: 'نظام فحص آلي دوري للروابط وخاصية الإبلاغ الفوري عن أي ملف غير متوفر.',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center space-y-3">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                  <feature.icon className="h-7 w-7" />
                </span>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                الأسئلة الشائعة حول امتحانات الجامعات المغربية
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                إجابات على أكثر التساؤلات تداولاً بين طلبة الكليات والتعليم العالي بالمغرب.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-right cursor-pointer"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                      {openFaq === idx ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
