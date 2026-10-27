import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  School,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '../components/Breadcrumbs';
import SEO from '../components/SEO';

export default function ExamGuidePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'الرئيسية', to: '/' },
    { label: 'دليل استدعاء الامتحانات الجامعية وجداول المراقبة' },
  ];

  const faqs = [
    {
      question: 'متى يتم الإعلان عن استدعاءات وجداول امتحانات الدورة العادية والاستدراكية؟',
      answer: 'عادةً ما تعلن الكليات المغربية عن جداول الامتحانات والاستدعاءات الفردية قبل موعد انطلاق الاختبارات بـ 7 إلى 10 أيام عبر الفضاء الرقمي للطالب (ENT / Apogée) أو لوحات الإعلانات بمقر الكلية.',
    },
    {
      question: 'ما هي الوثائق الإلزامية لدخول قاعة أو مدرج الامتحان؟',
      answer: 'يجب على كل طالب الإدلاء بـ: 1) بطاقة الطالب الجامعية (أو وصل التسجيل للسنة الجارية)، 2) بطاقة التعريف الوطنية (CNIE) الأصلية، 3) الاستدعاء الفردي للامتحان (Convocation) مطبوعاً إذا اشترطت الكلية ذلك.',
    },
    {
      question: 'ما هو التصرف القانوني في حالة تعذر الحضور للامتحان بسبب مبرر صحي؟',
      answer: 'يجب إيداع الشهادة الطبية الرسمية (مرفقة بطلب خطي) لدى مصلحة الشؤون الطلابية بالكلية داخل أجل لا يتعدى 48 ساعة من تاريخ إجراء الامتحان للاستفادة من حق اجتياز الدورة الاستدراكية دون خصم في النقط.',
    },
    {
      question: 'كيف يتم احتساب معدل استيفاء المجزوءة (Module) والفصل (Semestre)؟',
      answer: 'تستوفى المجزوءة بالحصول على نقطة تعادل أو تفوق 10 من 20. ويستوفى الفصل كاملاً إما باستيفاء جميع مجزوءاته، أو عن طريق المعاوضة (Compensation) إذا كان المعدل العام للفصل يعادل أو يفوق 10/20 مع عدم وجود أي نقطة موجبة للرسوب (أقل من 5/20 عادة حسب الملف الوصفي للمسلك).',
    },
  ];

  const universityPortals = [
    { name: 'جامعة ابن زهر (أكادير)', portal: 'الفضاء الرقمي UIZ ENT', link: 'https://ent.uiz.ac.ma' },
    { name: 'جامعة محمد الخامس (الرباط)', portal: 'منصة الطالب UM5', link: 'https://ent.um5.ac.ma' },
    { name: 'جامعة الحسن الثاني (الدار البيضاء)', portal: 'بوابة الخدمات الطلابية UH2C', link: 'https://www.univh2c.ma' },
    { name: 'جامعة القاضي عياض (مراكش)', portal: 'بوابة الامتحانات UCA Apogée', link: 'https://uca.ma' },
    { name: 'جامعة سيدي محمد بن عبد الله (فاس)', portal: 'فضاء الطالب USMBA', link: 'https://usmba.ac.ma' },
    { name: 'جامعة عبد المالك السعدي (طنجة/تطوان)', portal: 'البوابة الرقمية UAE', link: 'https://uae.ma' },
  ];

  const canonicalUrl = 'https://www.exammaroc.online/guide-convocation-examens';

  return (
    <>
      <SEO
        title="دليل استدعاء الامتحانات وجداول المراقبة بالجامعات المغربية 2024-2026 | ExamMaroc"
        description="الدليل الإرشادي الشامل للطلبة المغاربة: كيفية استخراج استدعاء الامتحانات الجامعية (Convocation)، الوثائق المطلوبة، ضوابط النزاهة داخل المدرجات، ونظام استيفاء الفصول والمجزوءات."
        canonical={canonicalUrl}
        keywords={[
          'استدعاء الامتحانات الجامعية بالمغرب',
          'convocation examen universite maroc',
          'جداول امتحانات الدورة العادية والاستدراكية',
          'استيفاء المجزوءات والمعاوضة',
          'بوابات الكليات المغربية ENT Apogee',
          'ضوابط اجتياز امتحانات الكلية',
        ]}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.to || canonicalUrl,
        }))}
        faqs={faqs}
      />

      <div className="container-academic py-6 sm:py-10">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <header className="mt-4 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 mb-3">
              <FileCheck className="h-3.5 w-3.5 text-blue-400" />
              <span>الإرشاد والتوجيه الجامعي للطلبة</span>
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold leading-tight">
              دليل استدعاء الامتحانات وجداول المراقبة بالجامعات المغربية
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              كل ما يحتاجه الطالب المغربي لاجتياز امتحانات الدورة العادية والاستدراكية بنجاح: طرق سحب الاستدعاء، الوثائق الإلزامية، مواعيد التوزيع على القاعات والمدرجات، وقواعد الاستيفاء والمعاوضة.
            </p>
          </div>
        </header>

        {/* Core Steps */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-academic p-6 bg-white border border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold mb-4">
              1
            </div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              استخراج استدعاء الامتحان (Convocation)
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              الدخول للبوابة الرقمية للكلية باستعمال بريد الطالب الأكاديمي والرقم الوطني (CNE/Massar)، وتحميل ورقة الاستدعاء التي تتضمن رقم الامتحان والمدرج المخصص.
            </p>
          </div>

          <div className="card-academic p-6 bg-white border border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold mb-4">
              2
            </div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              تجهيز الوثائق الثبوتية الإلزامية
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              بطاقة التعريف الوطنية (CNIE) الأصلية وبطاقة الطالب الصادرة عن الكلية شرط أساسي للجلوس في المدرج. لن يسمح باجتياز الامتحان بصور الهاتف.
            </p>
          </div>

          <div className="card-academic p-6 bg-white border border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold mb-4">
              3
            </div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              الحضور المبكر وضوابط القاعة
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              الحضور قبل موعد الامتحان بـ 20 دقيقة لمعرفة مكان الجلوس حسب الترتيب الأبجدي أو الأرقام التسلسلية، وإغلاق الهواتف الذكية ووضعها في المكان المخصص.
            </p>
          </div>
        </section>

        {/* University Portals Directory */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <School className="h-5 w-5 text-blue-600" />
            <span>بوابات الكليات لسحب استدعاءات الامتحانات</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {universityPortals.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.portal}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          </div>
        </section>

        {/* Action Link to Exams */}
        <section className="mt-10 rounded-2xl bg-blue-50 border border-blue-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-blue-950">
              جاهز لبدء المراجعة والتدرب على نماذج السنوات السابقة؟
            </h3>
            <p className="text-xs sm:text-sm text-blue-800 mt-1">
              تصفح أكثر من 740 نموذج امتحان مصحح لجميع الجامعات والشعب المغربية بصيغة PDF مجاناً.
            </p>
          </div>
          <Link
            to="/examens"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-700"
          >
            <span>تصفح نماذج الامتحانات</span>
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Link>
        </section>

        {/* FAQs */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>أسئلة شائعة حول سير الامتحانات بالجامعات المغربية</span>
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
