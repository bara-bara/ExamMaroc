import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, School, BookOpen, ArrowLeft, Zap, Layers, ShieldCheck, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Subject } from '../data/initialData';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const POPULAR_SEARCHES = ['Ibn Zohr', 'English S1', 'économie', 'droit', 'Microéconomie', 'FLSH Agadir'];
const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

const FAQS = [
  {
    question: 'كيف يمكنني تحميل نماذج امتحانات الجامعات المغربية بصيغة PDF؟',
    answer: 'يمكنك تصفح الامتحانات حسب جامعتك وكليتك وشعبتك أو البحث المباشر في شريط البحث. كل نموذج امتحان يتوفر على زر تحميل PDF مباشر مجاني دون الحاجة لإنشاء حساب أو دفع أي رسوم.',
  },
  {
    question: 'هل تتوفر امتحانات الدورة العادية والاستدراكية (Rattrapage)؟',
    answer: 'نعم، تضم المنصة نماذج امتحانات الدورة العادية (Session Normale) ودورة الاستدراك (Session Rattrapage) لمختلف الفصول من الفصل الأول S1 حتى الفصل السادس S6 مع تواريخ وتفاصيل كل دورة.',
  },
  {
    question: 'ما هي الجامعات المغربية المتاحة على المنصة؟',
    answer: 'تشمل المنصة كبرى الجامعات المغربية مثل جامعة ابن زهر بأكادير، جامعة محمد الخامس بالرباط، جامعة الحسن الثاني بالدار البيضاء، جامعة القاضي عياض بمراكش، جامعة سيدي محمد بن عبد الله بفاس، جامعة مولاي إسماعيل بمكناس، جامعة محمد الأول بوجدة والناظور، وجامعة عبد المالك السعدي بطنجة وتطوان، مع مختلف الكليات التابعة لها (FLSH, FSJES, FS) وملفات PDF ومعاينات سحابية مباشرة عبر Google Drive.',
  },
  {
    question: 'هل يمكنني المساهمة وإرسال نماذج امتحانات جديدة؟',
    answer: 'نعم! نرحب بمشاركات الطلبة والأساتذة لإثراء المنصة ومساعدة زملائهم. يمكنك مراسلتنا مباشرة عبر صفحة "اتصل بنا" أو البريد الإلكتروني لإضافة نماذج جديدة.',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [latestExams, setLatestExams] = useState<EnrichedExam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUniversities(StorageService.getUniversities().slice(0, 8));
    setLatestExams(StorageService.getExams({ limit: 8 }));
    setSubjects(StorageService.getSubjects().slice(0, 16));
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
        title="ExamMaroc - جميع نماذج امتحانات الجامعات المغربية في مكان واحد | تحميل PDF مجاناً"
        description="ابحث عن امتحانات سابقة حسب الجامعة، الشعبة، الفصل والمادة وحمّلها بسهولة بصيغة PDF مجاناً. المنصة الأكاديمية الأولى للطلاب الجامعيين بالمغرب."
        canonical="https://exammaroc.app/"
        keywords={[
          'امتحانات جامعية المغرب',
          'نماذج امتحانات الجامعات المغربية',
          'امتحانات جامعة ابن زهر',
          'امتحانات جامعة محمد الخامس',
          'امتحانات FSJES',
          'امتحانات FLSH',
          'امتحانات S1 S2 S3 S4 S5 S6',
          'تحميل امتحانات المغرب PDF',
        ]}
        faqs={FAQS}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ExamMaroc',
          url: 'https://exammaroc.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://exammaroc.app/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/50 via-slate-50/40 to-white">
        <div className="container-academic py-16 sm:py-24 text-center">
          <span className="chip bg-blue-100/80 text-blue-700 font-semibold mb-5 px-3 py-1 shadow-sm">
            منصة الامتحانات المغربية الأولى 🇲🇦
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            جميع نماذج امتحانات الجامعات المغربية في مكان واحد
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ابحث عن امتحانات سابقة حسب الجامعة، الشعبة، الفصل والمادة وحمّلها بسهولة بصيغة PDF منظمة ومجانية.
          </p>

          {/* Central Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-2xl">
            <div className="relative group">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                placeholder="ابحث عن الجامعة، المادة، الشعبة أو الامتحان..."
                className="w-full rounded-2xl border border-slate-300 bg-white py-4 pr-12 pl-4 text-base text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                autoFocus
              />
            </div>
            <p className="mt-2.5 text-xs text-slate-500">
              مثال للبحث: <span className="font-medium text-slate-700">English Ibn Zohr S1</span> أو <span className="font-medium text-slate-700">Microéconomie Agdal</span>
            </p>
          </form>

          {/* Popular searches tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium">الأكثر بحثًا:</span>
            {POPULAR_SEARCHES.map((query) => (
              <button
                key={query}
                onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                className="chip border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-academic py-12 space-y-16">
        {/* Browse by University */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                تصفح حسب الجامعة
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                اختر جامعتك للوصول إلى كلياتها وامتحاناتها السابقة.
              </p>
            </div>
            <Link
              to="/universites"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                to={`/universites/${uni.slug}`}
                className="card-academic p-5 flex items-start gap-4 hover:border-blue-300 group"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <School className="h-6 w-6" />
                </span>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {uni.name_ar}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {uni.name_fr}
                  </p>
                  <p className="text-xs text-slate-400">
                    {uni.city_ar} · {uni.city}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Ad Slot */}
        <AdSlot />

        {/* Latest Exams */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                آخر الامتحانات المضافة
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                أحدث النماذج المضافة إلى المنصة بصيغة PDF.
              </p>
            </div>
            <Link
              to="/latest-exams"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>

        {/* Most Searched Subjects */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">
            أكثر المواد بحثًا
          </h2>
          <div className="flex flex-wrap gap-3">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/search?q=${encodeURIComponent(sub.name_fr)}`}
                className="card-academic px-4 py-3 flex items-center gap-2.5 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <BookOpen className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-sm text-slate-800">
                  {sub.name_fr}
                </span>
                <span className="text-xs text-slate-400">
                  · {sub.name_ar}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Semester */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">
            تصفح حسب الفصل الدراسي (Semestre)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SEMESTERS.map((sem) => (
              <Link
                key={sem}
                to={`/search?q=${encodeURIComponent(sem)}`}
                className="card-academic py-6 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <span className="font-heading text-2xl font-bold text-blue-600 group-hover:scale-110 inline-block transition-transform">
                  {sem}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  الفصل {sem.replace('S', '')}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Why ExamMaroc? */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            لماذا منصة ExamMaroc؟
          </h2>
          <p className="text-center text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            صممت المنصة خصيصاً لتلبي احتياجات طلاب الجامعات المغربية ومساعدتهم على التفوق.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: 'سريع وفوري',
                desc: 'وصول مباشر وسريع للامتحان المطلوب بضغطة واحدة دون تعقيدات.',
              },
              {
                icon: Layers,
                title: 'هيكلة منظمة',
                desc: 'تصنيف هرمي دقيق: جامعة ← كلية ← شعبة ← فصل ← مادة.',
              },
              {
                icon: ShieldCheck,
                title: 'موثوق ومشروع',
                desc: 'موارد تعليمية مختارة بعناية ومتاحة قانونياً لخدمة الطلبة.',
              },
              {
                icon: Globe,
                title: 'متعدد اللغات',
                desc: 'دعم كامل للعربية والفرنسية والإنجليزية حسب شعبتك.',
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

        {/* Educational FAQ Section for Google SEO Snippets */}
        <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="chip bg-blue-100 text-blue-700 font-semibold">
                دليل الطالب
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                الأسئلة الشائعة حول امتحانات الجامعات المغربية
              </h2>
              <p className="text-sm text-slate-500">
                إليك إجابات شافية عن كيفية البحث والاستعداد للامتحانات الجامعية.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-right font-heading font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-base">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="h-5 w-5 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
