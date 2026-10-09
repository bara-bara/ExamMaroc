import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Calendar,
  School,
  Layers,
  BookOpen,
  Share2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Tag,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Flag,
  Globe,
  Printer,
  X,
  Send,
  HelpCircle
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import Breadcrumbs, { BreadcrumbItem } from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const SESSION_LABELS: Record<string, string> = {
  normale: 'دورة عادية (Session Normale)',
  rattrapage: 'دورة الاستدراك (Session Rattrapage)',
  autre: 'أخرى',
};

export default function ExamDetailPage() {
  const { examSlug, uniSlug, progSlug, semester, subSlug } = useParams<{
    examSlug?: string;
    uniSlug?: string;
    progSlug?: string;
    semester?: string;
    subSlug?: string;
  }>();

  // The slug can be in examSlug or last param
  const slug = examSlug || subSlug || semester || progSlug || uniSlug;

  const [exam, setExam] = useState<EnrichedExam | null>(null);
  const [relatedExams, setRelatedExams] = useState<EnrichedExam[]>([]);
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportType, setReportType] = useState<'broken_link' | 'wrong_file' | 'missing_pages' | 'suggest_correction' | 'other'>('broken_link');
  const [reportDetails, setReportDetails] = useState('');
  const [reportContact, setReportContact] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const found = StorageService.getExamBySlug(slug);
    if (found) {
      setExam(found);
      setDownloadCount(found.download_count || 0);
      setRelatedExams(StorageService.getRelatedExams(found, 6));
    } else {
      setExam(null);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="container-academic py-20 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-slate-500">جارٍ تجهيز نموذج الامتحان والتأكد من الروابط...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container-academic py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900">
          الامتحان غير موجود
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          لم نتمكن من العثور على هذا النموذج في الأرشيف الجامعي الحالي.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/examens"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <span>تصفح جميع الامتحانات المتاحة</span>
          </Link>
          <Link
            to="/examens-corriges"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span>الامتحانات المصححة</span>
          </Link>
        </div>
      </div>
    );
  }

  const uni = exam._university;
  const prog = exam._program;
  const fac = exam._faculty;
  const sub = exam._subject;

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'الرئيسية', to: '/' },
    { label: 'الامتحانات', to: '/examens' },
  ];

  if (uni) {
    breadcrumbs.push({ label: uni.name_ar, to: `/examens/${uni.slug}` });
  }
  if (uni && prog) {
    breadcrumbs.push({ label: prog.name_fr || prog.name_ar, to: `/universites/${uni.slug}/${prog.slug}` });
  }
  if (uni && prog && exam.semester) {
    breadcrumbs.push({
      label: exam.semester,
      to: `/examens/${uni.slug}/${prog.slug}/${exam.semester}`,
    });
  }
  if (sub) {
    breadcrumbs.push({ label: sub.name_fr || sub.name_ar });
  }
  breadcrumbs.push({ label: exam.title });

  // Extract Google Drive ID if available
  const driveMatch = (exam.source_url || exam.file_uri || '').match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/);
  const driveId = driveMatch ? driveMatch[1] : null;
  const isDriveFolder = (exam.source_url || '').includes('/folders/');

  // Convert Google Drive view URL to preview URL for iframe embedding
  let embedUrl = exam.file_uri || '';
  if (!embedUrl && exam.source_url) {
    if (exam.source_url.includes('drive.google.com/file/d/')) {
      embedUrl = exam.source_url.replace('/view', '/preview');
    } else {
      embedUrl = exam.source_url;
    }
  }

  const handleDownload = () => {
    const newCount = StorageService.incrementDownloadCount(exam.id);
    setDownloadCount(newCount);
    setDownloadSuccess(true);

    if (driveId && !isDriveFolder) {
      const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      window.open(directDownloadUrl, '_blank', 'noopener,noreferrer');
    } else if (exam.source_url) {
      window.open(exam.source_url, '_blank', 'noopener,noreferrer');
    } else {
      handlePrintablePaper();
    }

    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const handlePrintablePaper = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>${exam.title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            .header { border-bottom: 3px double #0284c7; padding-bottom: 20px; margin-bottom: 25px; text-align: center; }
            .title { font-size: 20px; font-weight: bold; color: #0f172a; margin: 12px 0; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold; margin: 2px; }
            .content { border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background: #ffffff; }
            .corr-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 6px; margin: 20px 0; }
            .btn-print { background: #059669; color: white; border: none; padding: 10px 24px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 20px; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>المملكة المغربية — وزارة التعليم العالي والبحث العلمي</h3>
            <h4>${uni ? uni.name_ar : 'الجامعة المغربية'} ${fac ? `— ${fac.name_ar}` : ''}</h4>
            <div class="title">${exam.title}</div>
            <div>
              <span class="badge">${exam.semester}</span>
              <span class="badge">${exam.session === 'normale' ? 'الدورة العادية' : 'الدورة الاستدراكية'}</span>
              <span class="badge">السنة: ${exam.year}</span>
              ${exam.correction_type !== 'sans_corrige' ? '<span class="badge" style="background:#dcfce7;color:#15803d;">يتوفر على عناصر الإجابة</span>' : ''}
            </div>
          </div>
          <div class="content">
            <h4>📄 موضوع أسئلة الامتحان:</h4>
            <p>${exam.description || 'نموذج امتحان رسمي موثق.'}</p>
            ${exam.correction_notes ? `<div class="corr-box"><strong>📌 عناصر الإجابة والملاحظات:</strong><p>${exam.correction_notes}</p></div>` : ''}
            <hr style="margin: 20px 0; border: none; border-top: 1px dashed #cbd5e1;" />
            <p><strong>توجيهات للطلبة:</strong></p>
            <ul>
              <li>التأكد من ملء البيانات الشخصية ورقم الامتحان بدقة.</li>
              <li>الإجابة بخط مقروء ومنظم مع تعليل الأجوبة القانونية أو الرياضية.</li>
              <li>مدة الإنجاز: ساعتان (2h00).</li>
            </ul>
            <button class="btn-print" onclick="window.print()">طباعة / حفظ كـ PDF</button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;

    StorageService.reportIssue(
      exam.id,
      exam.title,
      reportType,
      reportDetails.trim(),
      reportContact.trim()
    );

    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setIsReportOpen(false);
      setReportDetails('');
      setReportContact('');
    }, 2500);
  };

  const pageUrl = window.location.href;
  const shareTitle = `${exam.title} - تحميل بصيغة PDF من منصة ExamMaroc`;

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: exam.title,
    description: exam.seo_description || exam.description,
    educationalLevel: 'Higher Education / Université Marocaine',
    learningResourceType: 'Exam',
    encodingFormat: 'application/pdf',
    inLanguage: exam.language === 'ar' ? ['ar'] : ['fr', 'ar'],
    isAccessibleForFree: true,
    datePublished: String(exam.year),
    provider: uni
      ? {
          '@type': 'EducationalOrganization',
          name: uni.name_ar,
          alternateName: uni.name_fr,
          url: `https://exammaroc.online/universites/${uni.slug}`,
        }
      : undefined,
    about: sub
      ? {
          '@type': 'Thing',
          name: sub.name_ar,
          alternateName: sub.name_fr,
        }
      : undefined,
  };

  return (
    <>
      <SEO
        title={exam.seo_title || `${exam.title} | تحميل PDF - ExamMaroc`}
        description={
          exam.seo_description ||
          exam.description ||
          `تحميل نموذج امتحان ${exam.title} بصيغة PDF مجاناً. امتحانات سابقة منظمة للجامعات المغربية.`
        }
        canonical={pageUrl}
        type="article"
        keywords={exam.tags || [exam.title, exam.semester, uni?.name_ar || 'امتحانات جامعية', 'امتحانات مصححة']}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.to || window.location.pathname,
        }))}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <header className="mt-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Correction Pill */}
            {exam.correction_type === 'officiel' ? (
              <span className="chip bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold gap-1.5 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                تصحيح رسمي معتمد (Corrigé Officiel)
              </span>
            ) : exam.correction_type === 'propose' ? (
              <span className="chip bg-amber-100 text-amber-900 border border-amber-300 font-bold gap-1.5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                يتضمن حلاً مقترحاً (Proposition de Corrigé)
              </span>
            ) : (
              <span className="chip bg-slate-100 text-slate-700 font-medium px-2.5 py-1">
                موضوع الامتحان (بدون تصحيح)
              </span>
            )}

            <span className="chip bg-blue-50 text-blue-700 font-bold border border-blue-200/50 px-2.5 py-1">
              {exam.semester}
            </span>
            <span className="chip bg-slate-100 text-slate-700 font-medium px-2.5 py-1">
              {SESSION_LABELS[exam.session] || exam.session}
            </span>
            <span className="chip bg-slate-100 text-slate-700 font-medium inline-flex items-center gap-1 px-2.5 py-1">
              <Calendar className="h-3.5 w-3.5" />
              سنة {exam.year}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {exam.title}
          </h1>

          {exam.description && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
              {exam.description}
            </p>
          )}
        </header>

        {/* Content Layout (Viewer + Details Sidebar) */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column: Correction notice + PDF Viewer + Action Bar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Correction Callout Banner */}
            {exam.correction_type === 'officiel' ? (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 sm:p-5 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-emerald-900">
                    نموذج يتوفر على التصحيح الرسمي وسلم التنقيط
                  </h3>
                  <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                    {exam.correction_notes || 'هذا الامتحان مرفق بعناصر الإجابة الرسمية المعتمدة من أستاذ المادة، مما يتيح لك فهم معايير التصحيح وطريقة صياغة الأجوبة النموذجية.'}
                  </p>
                </div>
              </div>
            ) : exam.correction_type === 'propose' ? (
              <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 sm:p-5 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-amber-900">
                    يتوفر حل مقترح ومراجع
                  </h3>
                  <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                    {exam.correction_notes || 'يحتوي الملف على حل نموذجي مقترح ومفصل لأسئلة الامتحان لمساعدتك على المقارنة والتحضير الجيد.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-200/80 text-slate-600 shrink-0">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-800">
                      موضوع الامتحان (بدون عناصر إجابة رسمية)
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      هذا النموذج يتضمن نص الأسئلة فقط. إذا كان لديك حل نموذجي أو اقتراح تصحيح، يمكنك إرساله لنا لمساعدة زملائك الطلبة.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setReportType('suggest_correction');
                    setIsReportOpen(true);
                  }}
                  className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  اقتراح تصحيح
                </button>
              </div>
            )}

            {/* Viewer Card */}
            <div className="card-academic overflow-hidden bg-white shadow-sm border border-slate-200">
              {/* Viewer header bar */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span>معاينة نموذج الامتحان (PDF)</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintablePaper}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
                    title="طباعة ورقة الامتحان"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">طباعة</span>
                  </button>
                  <span className="chip bg-slate-200/80 text-slate-700 font-mono text-xs">
                    {exam.file_name || `${exam.slug}.pdf`}
                  </span>
                </div>
              </div>

              {/* PDF Preview Frame or Source View */}
              {embedUrl ? (
                <div className="relative w-full h-[65vh] min-h-[500px] bg-slate-100">
                  <iframe
                    src={embedUrl}
                    title={exam.title}
                    className="w-full h-full border-0"
                    allow="autoplay"
                  />
                </div>
              ) : (
                <div className="flex h-[55vh] flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-3">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-800">
                    ملف الامتحان متاح للتحميل والمعاينة
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm">
                    اضغط على زر التحميل المباشر أدناه لفتح ملف الـ PDF كاملاً على جهازك.
                  </p>
                </div>
              )}

              {/* Action Toolbar underneath Viewer */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>تحميل الامتحان PDF مجاناً</span>
                  </button>

                  {exam.source_url && (
                    <a
                      href={exam.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>معاينة في نافذة جديدة</span>
                    </a>
                  )}

                  <button
                    onClick={handlePrintablePaper}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>عرض ورقة قابلة للطباعة</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  تم تحميله <strong className="text-slate-900 font-bold">{downloadCount}</strong> مرة
                </div>
              </div>
            </div>

            {/* Download Notification */}
            {downloadSuccess && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>تم فتح رابط التحميل المباشر بنجاح! نرجو لك كامل التوفيق في الامتحانات.</span>
              </div>
            )}

            {/* Advice Box */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 space-y-2">
              <h3 className="font-heading font-bold text-sm text-blue-900">
                💡 نصيحة منهجية للتحضير:
              </h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                قسّم وقت الاختبار المخصص لساعتين؛ خصص أول 10 دقائق لقراءة موضوع الامتحان بعناية واختيار منهجية الإجابة المناسبة، وابدأ بالأسئلة الأسهل لجمع النقاط وضمان استثمار الوقت.
              </p>
            </div>
          </div>

          {/* Sidebar Column: Metadata, Verification & Provenance, Share, Report */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Exam Details Card */}
            <div className="card-academic p-6 space-y-5">
              <h2 className="font-heading text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                بطاقة الامتحان الأكاديمية
              </h2>

              <dl className="space-y-3.5 text-xs sm:text-sm">
                {uni && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                      <School className="h-4 w-4 text-blue-500" />
                      الجامعة:
                    </dt>
                    <dd className="font-bold text-slate-900 text-left">
                      <Link to={`/universites/${uni.slug}`} className="hover:text-blue-600">
                        {uni.name_ar}
                      </Link>
                    </dd>
                  </div>
                )}

                {fac && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                      <School className="h-4 w-4 text-slate-400" />
                      الكلية:
                    </dt>
                    <dd className="font-semibold text-slate-800 text-left">
                      {fac.name_ar}
                    </dd>
                  </div>
                )}

                {prog && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                      <Layers className="h-4 w-4 text-purple-500" />
                      الشعبة:
                    </dt>
                    <dd className="font-semibold text-slate-800 text-left">
                      <Link
                        to={uni ? `/universites/${uni.slug}/${prog.slug}` : '#'}
                        className="hover:text-blue-600"
                      >
                        {prog.name_fr || prog.name_ar}
                      </Link>
                    </dd>
                  </div>
                )}

                {sub && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                      المادة / الوحدة:
                    </dt>
                    <dd className="font-semibold text-slate-800 text-left">
                      {sub.name_fr || sub.name_ar}
                    </dd>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                    <Layers className="h-4 w-4 text-blue-500" />
                    الفصل الدراسي:
                  </dt>
                  <dd className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {exam.semester}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                    <Clock className="h-4 w-4 text-slate-400" />
                    الدورة:
                  </dt>
                  <dd className="font-medium text-slate-800">
                    {SESSION_LABELS[exam.session] || exam.session}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    السنة الجامعية:
                  </dt>
                  <dd className="font-bold text-slate-900">{exam.year}</dd>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                    <Globe className="h-4 w-4 text-slate-400" />
                    لغة الامتحان:
                  </dt>
                  <dd className="font-medium text-slate-800">
                    {exam.language === 'ar' ? 'العربية' : (exam.language === 'fr' ? 'الفرنسية' : 'ثنائي اللغة')}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                    <Download className="h-4 w-4 text-emerald-600" />
                    التحميلات:
                  </dt>
                  <dd className="font-bold text-emerald-600">{downloadCount}</dd>
                </div>
              </dl>

              {/* Verification & Trust Badge */}
              <div className="pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>ملف موثّق ونشط</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  <strong>المصدر:</strong> {exam.source_origin || 'الأرشيف الأكاديمي للجامعة'}.
                </p>
                <p className="text-[11px] text-slate-400">
                  تاريخ آخر تحقق: {exam.last_verified_date || '2026-10-06'}
                </p>

                {/* Report button */}
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                >
                  <Flag className="h-3 w-3" />
                  <span>الإبلاغ عن رابط معطل أو خطأ في الامتحان</span>
                </button>
              </div>
            </div>

            {/* Share Card */}
            <div className="card-academic p-5 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                مشاركة وتواصل عبر واتساب:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${shareTitle}\n${pageUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-center rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  مشاركة عبر واتساب
                </a>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <a
                  href="https://wa.me/212626551379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-emerald-700 font-medium py-1"
                >
                  <span>رقم الواتساب للتواصل:</span>
                  <span className="font-bold font-mono text-emerald-600 dir-ltr">+212 626-551379</span>
                </a>
              </div>
            </div>

            {/* Tags Card */}
            {exam.tags && exam.tags.length > 0 && (
              <div className="card-academic p-5 space-y-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Tag className="h-3 w-3 text-slate-400" />
                  الكلمات المفتاحية:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exam.tags.map((t, idx) => (
                    <Link
                      key={idx}
                      to={`/search?q=${encodeURIComponent(t)}`}
                      className="chip bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Exams Section */}
        {relatedExams.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                امتحانات سابقة ذات صلة بالمادة والشعبة
              </h2>
              <Link
                to="/examens"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <span>عرض المزيد</span>
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedExams.map((item) => (
                <ExamCard key={item.id} exam={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-right">
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute left-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <Flag className="h-5 w-5 text-rose-600" />
              <h3 className="font-heading text-lg font-bold">
                الإبلاغ عن مشكلة في نموذج الامتحان
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              نموذج: <strong className="text-slate-800">{exam.title}</strong>
            </p>

            {reportSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  شكراً لملاحظتك!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  تم تسجيل البلاغ وسيقوم فريق التحقق بمراجعة الرابط وتصحيح الخلل فوراً.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    نوع المشكلة:
                  </label>
                  <select
                    value={reportType}
                    onChange={(e: any) => setReportType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="broken_link">رابط التحميل أو المعاينة لا يعمل (Lien mort)</option>
                    <option value="wrong_file">الملف لا يطابق العنوان أو المادة</option>
                    <option value="missing_pages">نقص في بعض الصفحات أو جودة غير واضحة</option>
                    <option value="suggest_correction">اقتراح نموذج تصحيح أو إضافة حلول</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    تفاصيل الخلل أو الملاحظة:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="اكتب توضيحاً للخلل الذي واجهته حتى نتمكن من حله بسرعة..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    البريد الإلكتروني أو حساب التواصل (اختياري، لنخبرك عند إصلاح الرابط):
                  </label>
                  <input
                    type="text"
                    value={reportContact}
                    onChange={(e) => setReportContact(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>إرسال البلاغ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
