import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { School, Search, MapPin, BookOpen, Layers, ArrowLeft, Filter, GraduationCap } from 'lucide-react';
import { StorageService } from '../services/storageService';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

export default function FacultiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedUni, setSelectedUni] = useState<string>('all');

  const universities = useMemo(() => StorageService.getUniversities(), []);
  const allFaculties = useMemo(() => StorageService.getFaculties(), []);
  const allExams = useMemo(() => StorageService.getExams(), []);

  // Map faculty id to exam count
  const examCountMap = useMemo(() => {
    const map = new Map<string, number>();
    allExams.forEach((e) => {
      if (e.faculty_id) {
        map.set(e.faculty_id, (map.get(e.faculty_id) || 0) + 1);
      }
    });
    return map;
  }, [allExams]);

  // Types filter
  const facultyTypes = ['all', 'FSJES', 'FS', 'FLSH', 'FST', 'FP'];

  const filteredFaculties = useMemo(() => {
    return allFaculties.filter((f) => {
      if (selectedType !== 'all' && f.type !== selectedType) {
        return false;
      }
      if (selectedUni !== 'all' && f.university_id !== selectedUni) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameAr = (f.name_ar || '').toLowerCase();
        const nameFr = (f.name_fr || '').toLowerCase();
        const city = (f.city || '').toLowerCase();
        if (!nameAr.includes(q) && !nameFr.includes(q) && !city.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [allFaculties, selectedType, selectedUni, searchQuery]);

  return (
    <>
      <SEO
        title="دليل كليات المغرب الجامعية (FSJES, FS, FLSH, FST) ونماذج امتحاناتها [PDF] | ExamMaroc"
        description="دليل شامل لكليات ومؤسسات التعليم العالي بالجامعات المغربية الـ 12. تصفح كليات الحقوق والاقتصاد والعلوم والآداب والعلوم والتقنيات مع نماذج امتحانات كل مؤسسة مع عناصر الإجابة بصيغة PDF مجاناً."
        canonical="https://exammaroc.online/etablissements"
        keywords={[
          'كليات المغرب الجامعية',
          'دليل كليات FSJES بالمغرب',
          'كليات العلوم بالرباط الدار البيضاء فاس مراكش أكادير',
          'كلية الآداب والعلوم الإنسانية بالمغرب',
          'كليات العلوم والتقنيات FST بالمغرب',
          'مؤسسات جامعة محمد الخامس ابن زهر الحسن الثاني'
        ]}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الكليات والمؤسسات الجامعية' },
          ]}
        />

        {/* Header */}
        <section className="mt-4 mb-8 space-y-3 text-right">
          <span className="chip bg-blue-100 text-blue-800 font-bold px-3 py-1">
            دليل التعليم العالي المغربي 🇲🇦
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            الكليات والمؤسسات الجامعية بالمغرب
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            دليل موثّق لـ {allFaculties.length} كلية ومؤسسة جامعية تابعة لكبرى الجامعات المغربية، مع روابط مباشرة لمخزون الامتحانات السابقة والنماذج المصححة المتاحة لكل كلية.
          </p>
        </section>

        {/* Filter Controls */}
        <section className="card-academic p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم الكلية، المدينة، أو الرمز (FSJES)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* University selector */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none"
              >
                <option value="all">جميع الجامعات (12 جامعة)</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name_ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">نوع المؤسسة:</span>
            {facultyTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
                  selectedType === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t === 'all' ? 'جميع الأنواع' : t}
              </button>
            ))}
          </div>
        </section>

        {/* Faculties Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFaculties.map((fac) => {
            const uni = universities.find((u) => u.id === fac.university_id);
            const count = examCountMap.get(fac.id) || 0;

            return (
              <article
                key={fac.id}
                className="card-academic p-5 flex flex-col justify-between gap-4 group hover:border-blue-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="chip bg-blue-50 text-blue-700 font-bold border border-blue-200/50">
                      {fac.type || 'كلية جامعية'}
                    </span>
                    {fac.city && (
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {fac.city}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                      {fac.name_ar}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {fac.name_fr}
                    </p>
                  </div>

                  {uni && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
                      <School className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{uni.name_ar}</span>
                    </div>
                  )}

                  {fac.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {fac.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    {count} نموذج امتحان متوفر
                  </span>
                  <Link
                    to={uni ? `/examens/${uni.slug}` : `/examens`}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 group-hover:underline"
                  >
                    <span>عرض الامتحانات</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredFaculties.length === 0 && (
          <div className="py-20 text-center card-academic p-8">
            <h3 className="font-heading text-base font-bold text-slate-800">
              لم يتم العثور على مؤسسات مطابقة
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              جرب تغيير كلمات البحث أو إزالة فلتر نوع المؤسسة.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
