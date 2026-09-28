import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Zap, Layers, ShieldCheck, Globe, CheckCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="حول ExamMaroc - المنصة المغربية لنماذج الامتحانات الجامعية"
        description="ExamMaroc منصة مغربية تساعد الطلاب على الوصول إلى نماذج الامتحانات والموارد الدراسية بسهولة وبطريقة منظمة."
        canonical="https://exammaroc.app/about"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'حول الموقع', url: '/about' },
        ]}
      />

      <div className="container-academic py-8 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'حول الموقع' },
          ]}
        />

        <header className="mt-4 mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            حول منصة ExamMaroc
          </h1>
          <p className="mt-2 text-slate-600">
            مشروع أكاديمي مغربي مستقل لمساعدة طلبة الجامعات على التفوق والنجاح.
          </p>
        </header>

        <div className="card-academic p-6 sm:p-8 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            منصة <strong>ExamMaroc</strong> منصة مغربية تهدف إلى تنظيم ومشاركة الموارد التعليمية المتاحة بشكل مشروع، وتسهيل وصول الطلاب المغاربة في مختلف الجامعات إلى نماذج الامتحانات السابقة بصيغة PDF.
          </p>

          <p>
            نؤمن أن الوصول المنظم إلى الموارد التعليمية حق لكل طالب جامعي، لذلك بنينا المنصة بتصنيف هرمي واضح ومتكامل: <strong>الجامعة ← الكلية ← الشعبة ← الفصل ← المادة ← الامتحان</strong>، مع تزويدها ببحث داخلي قوي يدعم اللغات العربية والفرنسية والإنجليزية.
          </p>

          <p>
            المنصة مجانية تماماً ولا تتطلب التسجيل لتحميل الامتحانات. نحترم حقوق الملكية الفكرية، ويمكن لأصحاب الحقوق التواصل معنا مباشرة عبر صفحة{' '}
            <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
              اتصل بنا
            </Link>{' '}
            أو مراجعة{' '}
            <Link to="/dmca" className="text-blue-600 font-semibold hover:underline">
              سياسة حقوق النشر (DMCA)
            </Link>
            .
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Zap,
              t: 'سريع ومنظم',
              d: 'بحث فوري وتصنيف هرمي واضح للوصول السريع للامتحان المطلوب.',
            },
            {
              icon: Layers,
              t: 'قابل للتوسع',
              d: 'بنية تحتية تدعم آلاف النماذج من مختلف الجامعات والكليات المغربية.',
            },
            {
              icon: ShieldCheck,
              t: 'موثوق ومشروع',
              d: 'موارد تعليمية منظمة مع احترام كامل لحقوق الملكية الفكرية والتعليم المفتوح.',
            },
            {
              icon: Globe,
              t: 'متعدد اللغات',
              d: 'دعم كامل للمصطلحات بالعربية والفرنسية والإنجليزية لتسهيل التصفح.',
            },
          ].map((item) => (
            <div key={item.t} className="card-academic p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="font-heading font-bold text-slate-900">{item.t}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="mt-8 card-academic p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">للتواصل والاستفسار:</p>
              <a
                href="mailto:contact@exammaroc.app"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                contact@exammaroc.app
              </a>
            </div>
          </div>

          <Link
            to="/contact"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
          >
            إرسال رسالة
          </Link>
        </div>

        <AdSlot />
      </div>
    </>
  );
}
