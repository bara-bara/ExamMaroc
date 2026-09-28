import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title="سياسة الخصوصية - ExamMaroc"
        description="سياسة الخصوصية لمنصة ExamMaroc وكيفية معالجة بيانات الزوار واستخدام ملفات تعريف الارتباط والإعلانات."
        canonical="https://exammaroc.app/privacy-policy"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'سياسة الخصوصية', url: '/privacy-policy' },
        ]}
      />

      <div className="container-academic py-8 max-w-3xl">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'سياسة الخصوصية' },
          ]}
        />

        <header className="mt-4 mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            سياسة الخصوصية
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            آخر تحديث: سبتمبر 2026
          </p>
        </header>

        <div className="card-academic p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed bg-white">
          <p>
            تحترم منصة <strong>ExamMaroc</strong> خصوصية مستخدميها وزوارها. توضح هذه السياسة كيفية جمع البيانات واستخدامها وحمايتها عند تصفحك للموقع أو تحميل نماذج الامتحانات.
          </p>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              البيانات التي نجمعها
            </h2>
            <p>
              تصفح الموقع وتحميل نماذج الامتحانات لا يتطلب إنشاء حساب أو تسجيل دخول أو تقديم أي بيانات شخصية حساسة. قد نجمع بيانات تحليلية مجهولة الهوية مثل (عدد الزيارات، الصفحات الأكثر قراءة، وتعداد مرات تحميل الامتحانات) بغرض تحسين جودة الخدمة وتطوير المحتوى الأكاديمي.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              ملفات تعريف الارتباط (Cookies)
            </h2>
            <p>
              قد نستخدم ملفات تعريف ارتباط أساسية لتحسين تجربة المستخدم وحفظ التفضيلات المؤقتة، وأخرى خاصة بخدمات التحليلات والإعلانات الشريكة مثل (Google Analytics و Google AdSense) عند تفعيلها.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              الإعلانات وشركاء الطرف الثالث
            </h2>
            <p>
              قد نعرض إعلانات عبر منصة Google AdSense. قد تستخدم أطراف ثالثة ملفات تعريف ارتباط لعرض إعلانات ملائمة بناءً على زيارات المستخدمين السابقة لهذا الموقع أو لمواقع أخرى على شبكة الإنترنت. يمكنك تعطيل الإعلانات المخصصة عبر إعدادات الإعلانات في حساب Google الخاص بك.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              حماية المعلومات
            </h2>
            <p>
              نحن ملتزمون باتخاذ التدابير الأمنية والتقنية المعقولة للحفاظ على أمان المنصة ومنع الوصول غير المصرح به للمعلومات الفنية أو خوادم الاستضافة.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              التواصل معنا
            </h2>
            <p>
              إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية الخاصة بنا، يمكنك التواصل معنا عبر البريد الإلكتروني: <strong className="text-blue-600">contact@exammaroc.app</strong>.
            </p>
          </section>
        </div>

        <AdSlot />
      </div>
    </>
  );
}
