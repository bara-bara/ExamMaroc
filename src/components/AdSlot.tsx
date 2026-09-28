import React from 'react';

interface AdSlotProps {
  format?: string;
  className?: string;
}

export default function AdSlot({ format = 'auto', className = '' }: AdSlotProps) {
  return (
    <aside aria-label="مساحة إعلانية" className={`my-6 rounded-xl border border-dashed border-slate-200 bg-slate-100/60 p-4 text-center ${className}`}>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
        إعلان · Sponsored
      </p>
      <div className="flex min-h-[80px] items-center justify-center text-xs text-slate-500 font-medium">
        مساحة إعلانية مخصصة لـ Google AdSense
      </div>
    </aside>
  );
}
