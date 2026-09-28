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
        <p className="mt-4 text-sm text-slate-500">جارٍ تجهيز نموذج الامتحان...</p>
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
          يبدو أن هذا الامتحان غير موجود أو تم تحديث رابطه.
        </p>
        <Link
          to="/examens"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <span>تصفح جميع الامتحانات</span>
        </Link>
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
    breadcrumbs.push({ label: prog.name_fr, to: `/universites/${uni.slug}/${prog.slug}` });
  }
  if (uni && prog && exam.semester) {
    breadcrumbs.push({
      label: exam.semester,
      to: `/examens/${uni.slug}/${prog.slug}/${exam.semester}`,
    });
  }
  if (sub) {
    breadcrumbs.push({ label: sub.name_fr });
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
      // Direct PDF download via Google Drive export
      const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      window.open(directDownloadUrl, '_blank', 'noopener,noreferrer');
    } else if (exam.source_url) {
      window.open(exam.source_url, '_blank', 'noopener,noreferrer');
    } else {
      // Printable academic exam sheet for sample exams
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8">
            <title>${exam.title}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              .header { border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
              .title { font-size: 22px; font-weight: bold; color: #0f172a; margin: 10px 0; }
              .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold; margin: 2px; }
              .content { margin-top: 30px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background: #f8fafc; }
              .btn-print { background: #059669; color: white; border: none; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 20px; }
              @media print { .btn-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>المملكة المغربية — التعليم العالي</h2>
              <div class="title">${exam.title}</div>
              <div>
                <span class="badge">${exam.semester}</span>
                <span class="badge">${exam.session === 'normale' ? 'دورة عادية' : 'دورة استدراكية'}</span>
                <span class="badge">سنة ${exam.year}</span>
              </div>
            </div>
            <div class="content">
              <h3>ورقة أسئلة الامتحان:</h3>
              <p>${exam.description || 'نموذج امتحان رسمي معتمد.'}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px dashed #cbd5e1;" />
              <p><strong>توجيهات للمترشحين:</strong></p>
              <ul>
                <li>يمنع استعمال الهاتف النقال أو أي وسيلة إلكترونية داخل قاعة الامتحان.</li>
                <li>يجب الإجابة بخط واضح مع تنظيم ورقة التحرير وترقيم الأجوبة بدقة.</li>
                <li>مدة الإنجاز: ساعتان (2h00).</li>
              </ul>
              <button class="btn-print" onclick="window.print()">طباعة / حفظ كـ PDF</button>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    }

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const pageUrl = window.location.href;
  const shareTitle = `${exam.title} - تحميل بصيغة PDF من منصة ExamMaroc`;

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: exam.title,
    description: exam.seo_description || exam.description,
    educationalLevel: 'Higher Education / Université',
    learningResourceType: 'Exam',
    encodingFormat: 'application/pdf',
    inLanguage: ['ar', 'fr'],
    isAccessibleForFree: true,
    datePublished: String(exam.year),
    provider: uni
      ? {
          '@type': 'EducationalOrganization',
          name: uni.name_ar,
          alternateName: uni.name_fr,
          url: `https://exammaroc.app/universites/${uni.slug}`,
        }
      : undefined,
    about: sub
      ? {
          '@type': 'Thing',
          name: sub.name_fr,
          alternateName: sub.name_ar,
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
        keywords={exam.tags || [exam.title, exam.semester, uni?.name_ar || 'امتحانات جامعية']}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.to || window.location.pathname,
        }))}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <header className="mt-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="chip bg-blue-50 text-blue-700 font-bold border border-blue-200/50">
              {exam.semester}
            </span>
            <span className="chip bg-slate-100 text-slate-700 font-medium">
              {SESSION_LABELS[exam.session] || exam.session}
            </span>
            <span className="chip bg-slate-100 text-slate-700 font-medium inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              سنة {exam.year}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {exam.title}
          </h1>

          {exam.description && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              {exam.description}
            </p>
          )}
        </header>

        {/* Content Layout (Viewer + Details Sidebar) */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column: PDF Viewer and Action Bar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-academic overflow-hidden bg-white shadow-sm border border-slate-200">
              {/* Viewer header bar */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span>معاينة نموذج الامتحان (PDF)</span>
                </span>
                <span className="chip bg-slate-200/80 text-slate-700 font-mono text-xs">
                  {exam.file_name || `${exam.slug}.pdf`}
                </span>
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
                    ملف الامتحان متاح للتحميل المباشر
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm">
                    يمكنك تحميل ملف الـ PDF كاملاً وقراءته على جهازك أو طباعته.
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
                <span>تم فتح رابط التحميل المباشر بنجاح! شكراً لاستخدامك منصة ExamMaroc.</span>
              </div>
            )}

            {/* Educational Instructions */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 space-y-2">
              <h3 className="font-heading font-bold text-sm text-blue-900">
                💡 نصيحة للتحضير للاختبار:
              </h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                يُنصح بالتدرب على حل نموذج الامتحان في ظروف مطابقة للاختبار الحقيقي (المدة الزمنية، بدون الاستعانة بالمراجع)، ثم مراجعة الإجابات ونقاط القوة والضعف لضمان أعلى نقطة ممكنة.
              </p>
            </div>
          </div>

          {/* Sidebar Column: Metadata, Share, Tags */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Exam Details Card */}
            <div className="card-academic p-6 space-y-5 lg:sticky lg:top-24">
              <h2 className="font-heading text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                معلومات الامتحان
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
                    <dd className="font-semibold text-slate-800 text-left">{fac.name_ar}</dd>
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
                        {prog.name_fr}
                      </Link>
                    </dd>
                  </div>
                )}

                {sub && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                      المادة:
                    </dt>
                    <dd className="font-semibold text-slate-800 text-left">
                      {sub.name_fr}
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
                    <Download className="h-4 w-4 text-emerald-600" />
                    التحميلات:
                  </dt>
                  <dd className="font-bold text-emerald-600">{downloadCount}</dd>
                </div>
              </dl>

              {/* Share with Colleagues */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  شارك الامتحان مع زملائك:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${shareTitle}\n${pageUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
                  >
                    واتساب
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      pageUrl
                    )}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition-colors"
                  >
                    تيليجرام
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="نسخ الرابط"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Tags */}
              {exam.tags && exam.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-slate-400" />
                    الكلمات الدلالية (Tags):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/search?q=${encodeURIComponent(tag)}`}
                        className="chip bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <AdSlot />

        {/* Related Exams Recommendation */}
        {relatedExams.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              امتحانات ذات صلة وموصى بها
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedExams.map((rExam) => (
                <ExamCard key={rExam.id} exam={rExam} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
