import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { School, MapPin, ArrowLeft, Layers, FileText } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { University } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    setUniversities(StorageService.getUniversities());
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'الجامعات المغربية ونماذج الامتحانات',
    description: 'قائمة الجامعات المغربية المتاحة على منصة ExamMaroc مع نماذج الامتحانات السابقة بصيغة PDF.',
    itemListElement: universities.map((u, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'EducationalOrganization',
        name: u.name_ar,
        alternateName: u.name_fr,
        url: `https://exammaroc.app/universites/${u.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: u.city,
          addressCountry: 'MA',
        },
      },
    })),
  };

  return (
    <>
      <SEO
        title="الجامعات المغربية - نماذج الامتحانات حسب الجامعة | ExamMaroc"
        description="قائمة بجميع الجامعات المغربية المتوفرة على منصة ExamMaroc. تصفح وحمّل نماذج الامتحانات السابقة بصيغة PDF حسب كليات وشعب كل جامعة."
        canonical="https://exammaroc.app/universites"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الجامعات', url: '/universites' },
        ]}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الجامعات' },
          ]}
        />

        <header className="mt-4 mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            الجامعات المغربية
          </h1>
          <p className="mt-2 text-slate-600">
            تصفح نماذج الامتحانات والكليات حسب الجامعة في مختلف مدن المملكة.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni) => {
            const faculties = StorageService.getFaculties(uni.id);
            const examsCount = StorageService.getExams({ university_id: uni.id }).length;

            return (
              <div
                key={uni.id}
                className="card-academic p-6 flex flex-col justify-between hover:border-blue-300 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <School className="h-6 w-6" />
                    </span>
                    <span className="chip bg-slate-100 text-slate-700 text-xs font-semibold">
                      {examsCount} امتحان
                    </span>
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      <Link to={`/universites/${uni.slug}`}>{uni.name_ar}</Link>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                      {uni.name_fr}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      {uni.city_ar} · {uni.city}
                    </p>
                  </div>

                  {uni.description && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {uni.description}
                    </p>
                  )}

                  {faculties.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-400 block mb-1.5 font-medium">
                        الكليات والمؤسسات ({faculties.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {faculties.slice(0, 3).map((f) => (
                          <span
                            key={f.id}
                            className="chip bg-slate-50 text-slate-600 text-[11px]"
                          >
                            {f.slug.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/universites/${uni.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>عرض التفاصيل والكليات</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/examens/${uni.slug}`}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    جميع الامتحانات
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <AdSlot />
      </div>
    </>
  );
}
