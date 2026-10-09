import React, { useState } from 'react';
import { Mail, CheckCircle2, Send } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <SEO
        title="اتصل بنا - تواصل مع فريق ExamMaroc"
        description="تواصل مع فريق منصة ExamMaroc لأي استفسار أو ملاحظة أو طلب خاص بحقوق النشر أو اقتراح إضافة امتحانات جديدة."
        canonical="https://exammaroc.app/contact"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'اتصل بنا', url: '/contact' },
        ]}
      />

      <div className="container-academic py-8 max-w-2xl">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'اتصل بنا' },
          ]}
        />

        <header className="mt-4 mb-6">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            اتصل بنا
          </h1>
          <p className="mt-2 text-slate-600">
            يسعدنا تواصلك معنا لأي استفسار أو اقتراح أو ملاحظة بخصوص الامتحانات المنشورة.
          </p>
        </header>

        {/* WhatsApp Direct Contact Box */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-950 block">تواصل مباشر عبر واتساب (WhatsApp):</span>
            <a
              href="https://wa.me/212626551379"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 text-lg hover:underline dir-ltr inline-block font-mono"
            >
              +212 626-551379
            </a>
            <p className="text-[11px] text-emerald-800">
              متاح للرد على استفسارات الطلبة واستقبال نماذج الامتحانات والتصحيحات.
            </p>
          </div>
          <a
            href="https://wa.me/212626551379"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs shrink-0 inline-flex items-center gap-1.5"
          >
            <span>مراسلة عبر واتساب</span>
          </a>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base mb-1">شكرًا لك! تم استلام رسالتك.</h3>
              <p className="text-emerald-800">
                سنقوم بمراجعة طلبك أو ملاحظتك والرد عليك في أقرب وقت ممكن عبر البريد الإلكتروني.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-bold text-emerald-700 underline"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-academic p-6 sm:p-8 space-y-4 bg-white">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم الكامل *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: يوسف العلمي"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@domain.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الموضوع
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="استفسار، اقتراح نموذج، حقوق نشر..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرسالة *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="اكتب رسالتك أو تفاصيل النموذج المقترح هنا..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>إرسال الرسالة</span>
            </button>
          </form>
        )}

        <AdSlot />
      </div>
    </>
  );
}
