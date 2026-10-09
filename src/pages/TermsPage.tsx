import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function TermsPage() {
  return (
    <>
      <SEO
        title="شروط الاستخدام - ExamMaroc"
        description="شروط استخدام منصة ExamMaroc لتنظيم ومشاركة الموارد التعليمية ونماذج الامتحانات الجامعية."
        canonical="https://exammaroc.online/terms"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'شروط الاستخدام', url: '/terms' },
        ]}
      />

      <div className="container-academic py-8 max-w-3xl">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'شروط الاستخدام' },
          ]}
        />

        <header className="mt-4 mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            شروط الاستخدام
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            يرجى قراءة هذه الشروط بعناية قبل استخدام المنصة.
          </p>
        </header>

        <div className="card-academic p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed bg-white">
          <p>
            باستخدامك لمنصة <strong>ExamMaroc</strong> وتصفحها أو تحميل أي محتوى منها، فإنك تقر وتوافق على الالتزام بالشروط والأحكام المبينة أدناه.
          </p>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              طبيعة المحتوى والهدف منه
            </h2>
            <p>
              ExamMaroc منصة تهدف إلى تنظيم وتيسير الوصول إلى الموارد التعليمية المتاحة بشكل مشروع. المحتوى والنماذج المعروضة مقدمة لأغراض دراسية ومراجعة أكاديمية شخصية فقط، ولا نتحمل أي مسؤولية عن أي تغييرات في المناهج الرسمية التي تقرها الجامعات.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              الاستخدام المسؤول
            </h2>
            <p>
              يلتزم المستخدم بعدم إساءة استخدام المنصة، وعدم محاولة إلحاق الضرر بالخوادم أو تنفيذ عمليات كشط مؤذية (Aggressive Scraping) أو محاولة تعطيل الخدمة بأي شكل من الأشكال.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              الملكية الفكرية
            </h2>
            <p>
              نحن نحترم حقوق الملكية الفكرية. في حال وجود أي محتوى يعتقد صاحب الحق أنه منشور بدون تصريح، يرجى التكرم بالرجوع إلى صفحة{' '}
              <Link to="/dmca" className="text-blue-600 font-semibold hover:underline">
                سياسة حقوق النشر (DMCA)
              </Link>{' '}
              وإرسال إشعار لإزالته فوراً.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              إخلاء المسؤولية
            </h2>
            <p>
              يتم توفير الموقع ومحتوياته "كما هي" دون أي ضمانات صريحة أو ضمنية. لا تضمن ExamMaroc خلو الموقع من الأخطاء العرضية، ولكننا نعمل جاهدين على تصحيح أي أخطاء يتم الإبلاغ عنها.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              تعديل الشروط
            </h2>
            <p>
              نحتفظ بالحق في تحديث وتعديل شروط الاستخدام هذه في أي وقت. استمرارك في استخدام الموقع بعد إجراء أي تعديلات يعتبر قبولاً ضمنياً بالشروط المحدثة.
            </p>
          </section>
        </div>

        <AdSlot />
      </div>
    </>
  );
}
