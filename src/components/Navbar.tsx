import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  GraduationCap,
  Menu,
  X,
  BookOpen,
  School,
  Layers,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { StorageService } from '../services/storageService';

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/examens-corriges', label: 'الامتحانات المصححة', badge: 'جديد' },
  { to: '/examens', label: 'بنك الامتحانات' },
  { to: '/universites', label: 'الجامعات الـ 12' },
  { to: '/etablissements', label: 'الكليات والمؤسسات' },
  { to: '/subjects', label: 'المواد' },
  { to: '/gestion-examens', label: 'التدقيق والجودة' },
];

const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

interface NavbarProps {
  onOpenMobileSearch?: () => void;
}

export default function Navbar({ onOpenMobileSearch }: NavbarProps) {
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

  // Live search debounced for desktop
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
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all shadow-2xs">
      <div className="container-academic">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs transition-transform group-hover:scale-105">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-base sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                ExamMaroc
              </span>
              <span className="text-[9px] sm:text-[10px] text-blue-600 font-bold hidden xs:inline leading-none">
                الأرشيف الجامعي المغربي
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search Bar & Auto-Suggest */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex relative flex-1 max-w-xs lg:max-w-sm"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                type="search"
                placeholder="ابحث عن امتحان، مادة، شعبة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2 pr-9 pl-3 text-xs outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-1 max-h-72 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          navigate(item.to);
                          setShowDropdown(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-slate-50 transition-colors text-right cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.type === 'university' && (
                            <School className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          )}
                          {item.type === 'subject' && (
                            <BookOpen className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          )}
                          {item.type === 'program' && (
                            <Layers className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                          )}
                          <span className="truncate font-medium text-slate-800">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 mr-2">
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

          {/* Quick Action Icons & Mobile Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* WhatsApp direct contact icon (always accessible) */}
            <a
              href="https://wa.me/212626551379"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors shadow-2xs"
              title="تواصل مباشر عبر واتساب"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">واتساب</span>
            </a>

            {/* Quick Search Button (Mobile/Tablet) */}
            <button
              onClick={() => {
                if (onOpenMobileSearch) {
                  onOpenMobileSearch();
                } else {
                  navigate('/search');
                }
              }}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              aria-label="البحث السريع"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="القائمة الرئيسية"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Search input in drawer */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                placeholder="ابحث عن امتحان، مادة، جامعة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2.5 pr-10 pl-4 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
            </form>

            {/* Primary Nav Links */}
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between min-h-[44px] transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {link.badge}
                      </span>
                    ) : (
                      <ChevronLeft className="h-3.5 w-3.5 text-slate-300" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Fast Semester Chips */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                تصفح سريع للفصول (S1 - S6):
              </span>
              <div className="grid grid-cols-6 gap-1.5">
                {SEMESTERS.map((sem) => (
                  <Link
                    key={sem}
                    to={`/examens?semester=${sem}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-slate-200 py-1.5 text-center text-xs font-bold text-blue-600 hover:bg-blue-50"
                  >
                    {sem}
                  </Link>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Box in mobile menu */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href="https://wa.me/212626551379"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>تواصل مباشر واستفسار (WhatsApp)</span>
                </div>
                <span className="font-mono text-emerald-700 dir-ltr">+212 626-551379</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
