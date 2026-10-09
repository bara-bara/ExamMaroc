import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, School, Layers, AlertCircle } from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import Breadcrumbs from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<EnrichedExam[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    setSearchInput(query);
    if (query.trim()) {
      const exams = StorageService.searchExams(query);
      setResults(exams);
      setSuggestions(StorageService.liveSearchSuggestions(query));
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <>
      <SEO
        title={
          query
            ? `امتحانات "${query}" مع التصحيح [PDF مجاناً] | ExamMaroc`
            : 'محرك البحث في امتحانات الجامعات المغربية [PDF مع التصحيح] | ExamMaroc'
        }
        description={`نتائج البحث وتحميل نماذج امتحانات ${query || 'الجامعات المغربية'} السابقة بصيغة PDF مع عناصر الإجابة والحلول المعتمدة مجاناً.`}
        canonical={`https://exammaroc.online/search?q=${encodeURIComponent(query)}`}
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'البحث', url: '/search' },
        ]}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'البحث' },
          ]}
        />

        {/* Search Header */}
        <header className="mt-4 mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Search className="h-7 w-7 text-blue-600" />
            <span>نتائج البحث</span>
          </h1>
          {query && (
            <p className="mt-1 text-sm text-slate-500">
              عرض النتائج المطابقة لـ: <span className="font-bold text-slate-900">"{query}"</span> ({results.length} امتحان)
            </p>
          )}

          {/* Search box */}
          <form onSubmit={handleSubmit} className="mt-4 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحث عن الجامعة، المادة، الشعبة أو الامتحان..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
              />
            </div>
          </form>
        </header>

        {/* Related University or Program Suggestions if any */}
        {suggestions.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
            <span className="text-xs font-bold text-slate-500 block">
              مقترحات سريعة ذات صلة:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <Link
                  key={idx}
                  to={s.to}
                  className="chip border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-xs py-1 px-2.5 transition-colors gap-1.5"
                >
                  {s.type === 'university' && <School className="h-3 w-3 text-blue-500" />}
                  {s.type === 'program' && <Layers className="h-3 w-3 text-purple-500" />}
                  <span>{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto" />
            <h2 className="font-heading font-bold text-lg text-slate-800">
              لم نعثر على نتائج مطابقة لـ "{query}"
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              جرب البحث بكلمات أبسط مثل "Ibn Zohr"، أو "S1"، أو اسم المادة بالفرنسية.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {['Ibn Zohr', 'English S1', 'Microéconomie', 'S1', 'S2'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchParams({ q: term })}
                  className="chip bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        <AdSlot />
      </div>
    </>
  );
}
