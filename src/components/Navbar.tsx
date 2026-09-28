import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, GraduationCap, Menu, X, BookOpen, School, Layers, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storageService';

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/universites', label: 'الجامعات' },
  { to: '/examens', label: 'الامتحانات' },
  { to: '/subjects', label: 'المواد' },
  { to: '/latest-exams', label: 'آخر الامتحانات' },
  { to: '/about', label: 'حول الموقع' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // Live search debounced
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const results = StorageService.liveSearchSuggestions(searchQuery);
      setSuggestions(results);
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md transition-all">
      <div className="container-academic">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-blue-400" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 leading-tight">
                ExamMaroc
              </span>
              <span className="text-[10px] text-blue-600 font-medium">
                بنك الامتحانات الجامعية
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Live Search Input with Dropdown */}
          <div className="hidden md:block flex-1 max-w-md" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                type="search"
                placeholder="ابحث عن الجامعة، المادة، الشعبة أو الامتحان..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2.5 pr-10 pl-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-1">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          navigate(item.to);
                          setShowDropdown(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors text-right"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.type === 'university' && (
                            <School className="h-4 w-4 text-blue-500 shrink-0" />
                          )}
                          {item.type === 'subject' && (
                            <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                          )}
                          {item.type === 'program' && (
                            <Layers className="h-4 w-4 text-purple-500 shrink-0" />
                          )}
                          <span className="truncate font-medium text-slate-800">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-normal shrink-0 mr-2">
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
            </form>
          </div>

          {/* Quick Admin & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="لوحة الإدارة"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
              <span>الإشراف</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-4 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                placeholder="ابحث عن امتحان، مادة، جامعة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </form>

            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>لوحة تحكم المشرفين</span>
                <ShieldCheck className="h-4 w-4 text-slate-400" />
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
