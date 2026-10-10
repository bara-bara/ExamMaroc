import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, School, BookOpen, Layers, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_TOPICS = [
  { label: 'القانون الجنائي S2', query: 'القانون الجنائي' },
  { label: 'Microéconomie S1', query: 'Microéconomie' },
  { label: 'الالتزامات والعقود DOC', query: 'الالتزامات والعقود' },
  { label: 'Comptabilité Générale', query: 'Comptabilité' },
  { label: 'Analyse 1 SMPC', query: 'Analyse 1' },
  { label: 'امتحانات مصححة', query: 'مصحح', link: '/examens-corriges' },
];

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSuggestions([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      const results = StorageService.liveSearchSuggestions(query);
      setSuggestions(results);
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelect = (to: string) => {
    navigate(to);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="البحث السريع في الامتحانات الجامعية"
      className="fixed sm:absolute inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-150"
    >
      {/* Top Search Header Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 bg-slate-50/80">
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مادة، كلية، أستاذ، شعبة..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-11 pl-9 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              aria-label="مسح النص"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60"
        >
          إلغاء
        </button>
      </div>

      {/* Results / Suggestions Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Live suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-2">اقتراحات فورية:</h3>
            <div className="space-y-1">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.to)}
                  className="flex w-full items-center justify-between rounded-xl p-3 text-right text-xs hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.type === 'university' && (
                      <School className="h-4 w-4 text-blue-500 shrink-0" />
                    )}
                    {item.type === 'subject' && (
                      <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                    {item.type === 'program' && (
                      <Layers className="h-4 w-4 text-purple-500 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900 truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 mr-2">
                    {item.type === 'university'
                      ? 'جامعة'
                      : item.type === 'subject'
                      ? 'مادة'
                      : 'شعبة'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick topic shortcuts */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>الأكثر بحثاً بين الطلبة:</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic.label}
                type="button"
                onClick={() => {
                  if (topic.link) {
                    navigate(topic.link);
                    onClose();
                  } else {
                    setQuery(topic.query);
                    navigate(`/search?q=${encodeURIComponent(topic.query)}`);
                    onClose();
                  }
                }}
                className="chip bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 px-3 py-1.5 text-xs text-slate-700 transition-colors cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Semester Jump */}
        <div className="pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 mb-2">تصفح الفصول الدراسية:</h3>
          <div className="grid grid-cols-3 gap-2">
            {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => handleSelect(`/examens?semester=${sem}`)}
                className="rounded-xl border border-slate-200 p-2.5 text-center font-heading font-black text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm block">{sem}</span>
                <span className="text-[10px] text-slate-500 font-normal">الفصل {sem.replace('S', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
