import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';

const QUICK_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/examens-corriges', label: 'الامتحانات المصححة' },
  { to: '/examens', label: 'بنك الامتحانات' },
  { to: '/universites', label: 'الجامعات الـ 12' },
  { to: '/etablissements', label: 'الكليات والمؤسسات' },
  { to: '/subjects', label: 'المواد الدراسية' },
  { to: '/latest-exams', label: 'آخر الامتحانات' },
  { to: '/gestion-examens', label: 'التدقيق والأتمتة' },
  { to: '/about', label: 'حول الموقع' },
  { to: '/contact', label: 'اتصل بنا والإبلاغ' },
  { to: '/privacy-policy', label: 'سياسة الخصوصية' },
  { to: '/dmca', label: 'حقوق النشر (DMCA)' },
];

const UNIVERSITIES_SEO = [
  { to: '/universites/ibn-zohr', label: 'جامعة ابن زهر (أكادير والجنوب)' },
  { to: '/universites/mohammed-v', label: 'جامعة محمد الخامس (الرباط)' },
  { to: '/universites/hassan-2', label: 'جامعة الحسن الثاني (الدار البيضاء)' },
  { to: '/universites/cadi-ayyad', label: 'جامعة القاضي عياض (مراكش)' },
  { to: '/universites/sidi-mohamed-ben-abdellah', label: 'جامعة سيدي محمد بن عبد الله (فاس)' },
  { to: '/universites/moulay-ismail', label: 'جامعة مولاي إسماعيل (مكناس)' },
  { to: '/universites/mohammed-premier', label: 'جامعة محمد الأول (وجدة والناظور)' },
  { to: '/universites/abdelmalek-essaadi', label: 'جامعة عبد المالك السعدي (طنجة وتطوان)' },
  { to: '/universites/ibn-tofail', label: 'جامعة ابن طفيل (القنيطرة)' },
  { to: '/universites/chouaib-doukkali', label: 'جامعة شعيب الدكالي (الجديدة)' },
  { to: '/universites/sultan-moulay-slimane', label: 'جامعة السلطان مولاي سليمان (بني ملال)' },
  { to: '/universites/hassan-premier', label: 'جامعة الحسن الأول (سطات)' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/90 mt-16 text-slate-600">
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
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              أكبر بنك رقمي لنماذج امتحانات الجامعات المغربية والموارد الأكاديمية المصححة بصيغة PDF مجاناً. منصة مستقلة لخدمة الطلبة والباحثين.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>محتوى تعليمي موثّق ومفحوص الروابط</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
              أقسام المنصة
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
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
            <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
              الجامعات المغربية الـ 12
            </h3>
            <ul className="space-y-1.5 text-xs">
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

          {/* Contact & Verification info */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
              تواصل ومساعدة
            </h3>
            <a
              href="mailto:contact@exammaroc.online"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              contact@exammaroc.online
            </a>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>نطاق معتمد: exammaroc.online</span>
              </div>
              <p className="text-[11px] text-slate-400">
                تم التحقق من النطاق عبر Google Search Console.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ExamMaroc. جميع الحقوق محفوظة للطلاب المغاربة.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-600">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-slate-600">شروط الاستخدام</Link>
            <Link to="/dmca" className="hover:text-slate-600">DMCA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
