import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, CheckCircle2, School, Search } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenSearch?: () => void;
  isPhoneMode?: boolean;
}

export default function MobileBottomNav({ onOpenSearch, isPhoneMode = true }: MobileBottomNavProps) {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'الرئيسية',
      icon: Home,
      exact: true,
    },
    {
      to: '/examens',
      label: 'الامتحانات',
      icon: FileText,
    },
    {
      to: '/examens-corriges',
      label: 'المصححة',
      icon: CheckCircle2,
      badge: 'حلول',
    },
    {
      to: '/universites',
      label: 'الجامعات',
      icon: School,
    },
    {
      to: '/search',
      label: 'بحث',
      icon: Search,
      action: onOpenSearch,
    },
  ];

  return (
    <nav
      aria-label="التصفح السريع للهاتف"
      className={`${
        isPhoneMode
          ? 'sticky bottom-0 z-40 w-full'
          : 'fixed bottom-0 left-0 right-0 z-40 md:hidden'
      } bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0 transition-all`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)' }}
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          if (item.action) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`flex flex-col items-center justify-center h-full w-full py-1 gap-0.5 transition-colors touch-manipulation active:scale-95 cursor-pointer ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center h-full w-full py-1 gap-0.5 transition-colors touch-manipulation active:scale-95 ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -left-2 px-1 py-0.1 text-[8px] font-extrabold rounded-full bg-emerald-600 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-blue-600" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
