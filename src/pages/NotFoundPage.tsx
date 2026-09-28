import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="الصفحة غير موجودة (404) - ExamMaroc"
        description="الصفحة أو نموذج الامتحان الذي تبحث عنه غير موجود."
        canonical="https://exammaroc.app/404"
      />

      <div className="container-academic py-20 text-center">
        <p className="font-heading text-8xl font-black text-blue-600 tracking-wider">
          404
        </p>
        <h1 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
          يبدو أن هذا الامتحان أو الصفحة غير موجودة
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          قد يكون الرابط غير صحيح، أو تم نقل الصفحة إلى تصنيف آخر.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <Link
            to="/examens"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>تصفح كل الامتحانات</span>
          </Link>
        </div>
      </div>
    </>
  );
}
