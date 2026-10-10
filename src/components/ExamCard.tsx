import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, Calendar, School, Layers, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { EnrichedExam, StorageService } from '../services/storageService';

interface ExamCardProps {
  exam: EnrichedExam;
  enriched?: EnrichedExam;
}

const SESSION_LABELS: Record<string, string> = {
  normale: 'دورة عادية',
  rattrapage: 'دورة الاستدراك',
  autre: 'أخرى',
};

export default function ExamCard({ exam, enriched }: ExamCardProps) {
  const item = enriched || exam;
  const uni = item._university;
  const prog = item._program;
  const sub = item._subject;
  const fac = item._faculty;

  const detailUrl =
    uni && prog && item.semester && sub
      ? `/examens/${uni.slug}/${prog.slug}/${item.semester}/${sub.slug}/${item.slug}`
      : `/examens/${item.slug}`;

  const sessionLabel = SESSION_LABELS[item.session] || 'دورة عادية';

  const handleDownloadClick = () => {
    StorageService.incrementDownloadCount(item.id);
  };

  return (
    <article
      itemScope
      itemType="https://schema.org/EducationalResource"
      className="card-academic p-3.5 sm:p-5 flex flex-col justify-between gap-3 group hover:border-blue-400 transition-all duration-200"
    >
      <div className="space-y-2.5">
        {/* Header with Title and PDF Tag */}
        <div className="flex items-start justify-between gap-2">
          <Link
            to={detailUrl}
            itemProp="name"
            className="font-heading font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors text-xs sm:text-base"
          >
            {item.title}
          </Link>
          <span className="chip bg-red-50 text-red-600 border border-red-200/60 shrink-0 font-bold gap-1 text-[10px] sm:text-[11px] px-1.5 py-0.5">
            <FileText className="h-3 w-3" />
            PDF
          </span>
        </div>

        {/* Badges / Correction & Session & Semester */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {/* Correction Badge */}
          {item.correction_type === 'officiel' ? (
            <span className="chip bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold gap-1 text-[10px] sm:text-[11px] px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
              تصحيح رسمي
            </span>
          ) : item.correction_type === 'propose' ? (
            <span className="chip bg-amber-50 text-amber-800 border border-amber-300 font-semibold gap-1 text-[10px] sm:text-[11px] px-2 py-0.5">
              <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
              حل مقترح
            </span>
          ) : (
            <span className="chip bg-slate-100 text-slate-600 font-medium text-[10px] sm:text-[11px] px-2 py-0.5">
              بدون تصحيح
            </span>
          )}

          {item.semester && (
            <span className="chip bg-blue-50 text-blue-700 font-extrabold border border-blue-200/60 text-[10px] sm:text-[11px] px-2 py-0.5">
              {item.semester}
            </span>
          )}

          <span className="chip bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] px-2 py-0.5">
            {sessionLabel}
          </span>

          <span className="chip bg-slate-100 text-slate-600 inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] px-2 py-0.5">
            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-60" />
            {item.year}
          </span>
        </div>

        {/* University, Faculty & Program info */}
        <div className="space-y-0.5 text-[11px] sm:text-xs text-slate-500 pt-0.5">
          {uni && (
            <p className="flex items-center gap-1.5 truncate">
              <School className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="truncate font-semibold text-slate-700">{uni.name_ar}</span>
              {fac && <span className="text-slate-400 truncate">({fac.name_fr || fac.name_ar})</span>}
            </p>
          )}
          {prog && (
            <p className="flex items-center gap-1.5 truncate text-slate-600">
              <Layers className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{prog.name_fr || prog.name_ar}</span>
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px] shrink-0">
          <span>{item.download_count || 0} تحميل</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to={detailUrl}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-50 transition-colors h-8 sm:h-9 text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>عرض</span>
          </Link>

          {item.source_url ? (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadClick}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-2xs h-8 sm:h-9 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>تحميل PDF</span>
            </a>
          ) : (
            <Link
              to={detailUrl}
              onClick={handleDownloadClick}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-2xs h-8 sm:h-9 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>تحميل PDF</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
