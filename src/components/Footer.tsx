import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ShieldCheck, Heart } from 'lucide-react';

const QUICK_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/universites', label: 'الجامعات' },
  { to: '/examens', label: 'الامتحانات' },
  { to: '/subjects', label: 'المواد الدراسية' },
  { to: '/latest-exams', label: 'آخر الامتحانات' },
  { to: '/about', label: 'حول الموقع' },
  { to: '/contact', label: 'اتصل بنا' },
  { to: '/privacy-policy', label: 'سياسة الخصوصية' },
  { to: '/terms', label: 'شروط الاستخدام' },
  { to: '/dmca', label: 'حقوق النشر (DMCA)' },
];

const UNIVERSITIES_SEO = [
  { to: '/universites/ibn-zohr', label: 'جامعة ابن زهر أكادير' },
  { to: '/universites/mohammed-v', label: 'جامعة محمد الخامس الرباط' },
  { to: '/universites/hassan-2', label: 'جامعة الحسن الثاني الدار البيضاء' },
  { to: '/universites/cadi-ayyad', label: 'جامعة القاضي عياض مراكش' },
  { to: '/universites/sidi-mohamed-ben-abdellah', label: 'جامعة سيدي محمد بن عبد الله فاس' },
  { to: '/universites/moulay-ismail', label: 'جامعة مولاي إسماعيل مكناس' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 mt-16 text-slate-600">
      <div className="container-academic py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </span>
              <span className="font-heading text-xl font-bold text-slate-900">
                ExamMaroc
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              منصة مغربية أكاديمية تهدف إلى تنظيم وتسهيل وصول طلاب الجامعات المغربية إلى نماذج الامتحانات السابقة والموارد الدراسية بصيغة PDF مجاناً.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>موارد دراسية مصنفة ومنظمة</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
              روابط سريعة
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Universities directory for SEO */}
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
              الجامعات المغربية
            </h3>
            <ul className="space-y-2 text-sm">
              {UNIVERSITIES_SEO.map((u) => (
                <li key={u.to}>
                  <Link
                    to={u.to}
                    className="hover:text-blue-600 transition-colors block truncate"
                  >
                    {u.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal disclaimer */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
              تواصل معنا
            </h3>
            <a
              href="mailto:contact@exammaroc.app"
              className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              contact@exammaroc.app
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة ExamMaroc تعمل على تنظيم ومشاركة الموارد التعليمية المتاحة بشكل مشروع ومفتوح للطلاب. لأصحاب الحقوق الفكرية: تواصلوا معنا فوراً بخصوص أي ملاحظة أو طلب إزالة محتوى.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ExamMaroc. جميع الحقوق محفوظة.</p>
          <p className="inline-flex items-center gap-1.5 font-medium">
            <span>صُنع بحب للطلاب المغاربة</span>
            <span className="text-sm">🇲🇦</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
