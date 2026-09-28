import React from 'react';
import { Mail, ShieldAlert } from 'lucide-react';
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

          {/* Contact Box */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-blue-950 block">البريد الإلكتروني المخصص للإبلاغ:</span>
                <a
                  href="mailto:dmca@exammaroc.app"
                  className="font-bold text-blue-700 text-base hover:underline"
                >
                  dmca@exammaroc.app
                </a>
              </div>
            </div>

            <span className="text-xs text-blue-800 font-medium">
              الاستجابة خلال 24 - 48 ساعة كحد أقصى.
            </span>
          </div>

          <p className="text-xs text-slate-400">
            تلتزم إدارة ExamMaroc بمراجعة جميع الشكاوى فور استلامها وحذف أي محتوى مخالف فور التحقق من هوية صاحب الحق دون أي تأخير.
          </p>
        </div>

        <AdSlot />
      </div>
    </>
  );
}
