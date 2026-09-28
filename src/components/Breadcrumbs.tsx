import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 py-1">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-blue-600 transition-colors rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-slate-900' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronLeft className="h-3.5 w-3.5 opacity-50 shrink-0" />}
          </span>
        );
      })}
    </nav>
  );
}
