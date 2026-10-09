import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function DmcaPage() {
  return (
    <>
      <SEO
        title="سياسة حقوق النشر (DMCA) - ExamMaroc"
        description="سياسة ExamMaroc بشأن حقوق النشر والملكية الفكرية وكيفية الإبلاغ عن محتوى أو طلب حذفه فوراً."
        canonical="https://exammaroc.app/dmca"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'حقوق النشر', url: '/dmca' },
        ]}
      />

      <div className="container-academic py-8 max-w-3xl">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'حقوق النشر (DMCA)' },
          ]}
        />

        <header className="mt-4 mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            سياسة حقوق النشر (DMCA Notice)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            إجراءات الإبلاغ وطلب إزالة المحتوى المحمي بحقوق الملكية الفكرية.
          </p>
        </header>

        <div className="card-academic p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed bg-white">
          <p>
            تحترم منصة <strong>ExamMaroc</strong> حقوق الملكية الفكرية للآخرين وللمؤسسات التعليمية. نحن نعمل كمنصة لتنظيم وتيسير الوصول إلى الموارد التعليمية المتاحة بشكل مشروع ومفتوح لخدمة الصالح الأكاديمي للطلبة.
          </p>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <span>إجراءات الإبلاغ عن انتهاك حقوق النشر</span>
            </h2>
            <p>
              إذا كنت صاحب حق ملكية فكرية أو ممثلاً رسمياً وترى بحسن نية أن محتوى معروضاً على المنصة ينتهك حقوقك، يرجى تزويدنا بالمعلومات التالية في رسالة واضحة:
            </p>
            <ul className="list-disc pr-6 space-y-2 text-slate-700">
              <li>
                وصف مفصل للعمل المحمي بحقوق النشر الذي تدعي أنه تم انتهاكه.
              </li>
              <li>
                الرابط المباشر (URL) لصفحة نموذج الامتحان المخالف على موقع ExamMaroc.
              </li>
              <li>
                معلومات الاتصال الكاملة بك (الاسم الكامل، العنوان، رقم الهاتف، والبريد الإلكتروني الرسمي).
              </li>
              <li>
                إقرار كتابي بحسن النية يفيد بأن استخدام المادة المتنازع عليها غير مصرح به من قبل مالك الحق أو وكيله.
              </li>
              <li>
                إقرار بصحة البيانات المقدمة تحت طائلة المسؤولية القانونية.
              </li>
            </ul>
          </section>

          <p className="text-xs text-slate-400">
            تلتزم إدارة ExamMaroc بمراجعة جميع الشكاوى فور استلامها وحذف أي محتوى مخالف فور التحقق من هوية صاحب الحق دون أي تأخير.
          </p>
        </div>

        <AdSlot />
      </div>
    </>
  );
}
