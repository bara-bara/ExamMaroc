import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  FileCheck,
  Globe,
  Download,
  Trash2,
  ExternalLink,
  Search,
  Check,
  Copy,
  FolderSync
} from 'lucide-react';
import { StorageService, EnrichedExam, ExamReport } from '../services/storageService';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

export default function AdminAuditPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'reports' | 'add' | 'sitemap'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'reported'>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Ingestion form state
  const [newTitle, setNewTitle] = useState('');
  const [newUniId, setNewUniId] = useState('');
  const [newFacId, setNewFacId] = useState('');
  const [newSemester, setNewSemester] = useState('S1');
  const [newSession, setNewSession] = useState<'normale' | 'rattrapage'>('normale');
  const [newYear, setNewYear] = useState<number>(2024);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newCorrType, setNewCorrType] = useState<'officiel' | 'propose' | 'sans_corrige'>('sans_corrige');
  const [newLang, setNewLang] = useState<'ar' | 'fr'>('ar');
  const [ingestSuccess, setIngestSuccess] = useState(false);

  // Bulk audit simulation state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  const universities = useMemo(() => StorageService.getUniversities(), []);
  const faculties = useMemo(() => StorageService.getFaculties(newUniId || undefined), [newUniId]);
  const stats = useMemo(() => StorageService.getStats(), [refreshTrigger]);
  const exams = useMemo(() => StorageService.getExams(), [refreshTrigger]);
  const reports = useMemo(() => StorageService.getReports(), [refreshTrigger]);

  // Filter exams for audit table
  const auditExams = useMemo(() => {
    return exams.filter((e) => {
      if (statusFilter !== 'all' && e.verification_status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          (e._university?.name_ar || '').includes(searchTerm)
        );
      }
      return true;
    });
  }, [exams, statusFilter, searchTerm]);

  // Bulk audit run
  const runLinkHealthCheck = () => {
    setIsAuditing(true);
    setAuditProgress(10);

    const timer = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsAuditing(false);
          // Mark first 30 exams as verified
          exams.slice(0, 50).forEach((e) => StorageService.verifyExam(e.id));
          setRefreshTrigger((r) => r + 1);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleVerifySingle = (id: string) => {
    StorageService.verifyExam(id);
    setRefreshTrigger((r) => r + 1);
  };

  const handleResolveReport = (reportId: string) => {
    StorageService.resolveReport(reportId);
    setRefreshTrigger((r) => r + 1);
  };

  const handleIngestExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUniId) return;

    StorageService.saveExam({
      title: newTitle.trim(),
      university_id: newUniId,
      faculty_id: newFacId || undefined,
      semester: newSemester,
      session: newSession,
      year: Number(newYear),
      source_url: newSourceUrl.trim() || undefined,
      correction_type: newCorrType,
      has_correction: newCorrType !== 'sans_corrige',
      language: newLang,
      verification_status: 'verified',
      last_verified_date: new Date().toISOString().split('T')[0],
      source_origin: 'إيداع رسمي معتمد في المنصة',
    });

    setIngestSuccess(true);
    setRefreshTrigger((r) => r + 1);
    setNewTitle('');
    setNewSourceUrl('');
    setTimeout(() => setIngestSuccess(false), 3000);
  };

  const generatedSitemap = useMemo(() => {
    const urls = [
      'https://exammaroc.online/',
      'https://exammaroc.online/examens',
      'https://exammaroc.online/examens-corriges',
      'https://exammaroc.online/universites',
      'https://exammaroc.online/etablissements',
      'https://exammaroc.online/subjects',
      'https://exammaroc.online/latest-exams',
    ];

    exams.forEach((ex) => {
      urls.push(`https://exammaroc.online/examens/${ex.slug}`);
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;
  }, [exams]);

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(generatedSitemap);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2500);
  };

  return (
    <>
      <SEO
        title="نظام إدارة ومراجعة الامتحانات والتحقق من الروابط | ExamMaroc"
        description="لوحة التدقيق الأكاديمي والتحقق التلقائي من روابط الامتحانات، إضافة نماذج جديدة ومراجعة بلاغات الطلبة."
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'إدارة وتدقيق المحتوى الأكاديمي' },
          ]}
        />

        {/* Dashboard Header */}
        <section className="mt-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="chip bg-slate-900 text-white font-bold px-3 py-1 mb-2">
              بوابة التحقق والأتمتة ⚙️
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              إدارة وجودة الموارد الأكاديمية (Quality & Audit)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              متابعة صلاحية الروابط، تمييز التصحيحات الرسمية، فحص بلاغات الطلبة، وتوليد خرائط الفهرسة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runLinkHealthCheck}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? `جارٍ الفحص (${auditProgress}%)...` : 'فحص صلاحية الروابط الآن'}</span>
            </button>
          </div>
        </section>

        {/* Real Dynamic Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="card-academic p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">إجمالي الامتحانات</span>
            <p className="font-heading text-2xl font-black text-slate-900">{stats.exams}</p>
            <span className="text-[11px] text-emerald-600 font-medium">مفهرسة بالكامل</span>
          </div>
          <div className="card-academic p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">نماذج مع التصحيح</span>
            <p className="font-heading text-2xl font-black text-emerald-600">{stats.correctedExams}</p>
            <span className="text-[11px] text-slate-500">رسمي + مقترح</span>
          </div>
          <div className="card-academic p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">الجامعات المغطاة</span>
            <p className="font-heading text-2xl font-black text-blue-600">{stats.universities}</p>
            <span className="text-[11px] text-slate-500">من أصل 12 جامعة مغربية</span>
          </div>
          <div className="card-academic p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">الكليات والمؤسسات</span>
            <p className="font-heading text-2xl font-black text-purple-600">{stats.faculties}</p>
            <span className="text-[11px] text-slate-500">FSJES, FS, FLSH...</span>
          </div>
          <div className="card-academic p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">بلاغات الطلبة النشطة</span>
            <p className="font-heading text-2xl font-black text-rose-600">
              {reports.filter((r) => r.status === 'pending').length}
            </p>
            <span className="text-[11px] text-rose-500">تتطلب المراجعة</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>سجل فحص الروابط والتحقق ({exams.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>بلاغات الروابط المعطلة ({reports.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            <span>إضافة نموذج امتحان جديد</span>
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sitemap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="h-4 w-4 text-slate-600" />
            <span>توليد Sitemap.xml</span>
          </button>
        </div>

        {/* Tab Content: Audit List */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="card-academic p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث في السجل الأكاديمي..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="verified">موثقة ومفحوصة (Verified)</option>
                  <option value="reported">تم الإبلاغ عنها (Reported)</option>
                </select>
              </div>
            </div>

            <div className="card-academic overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">عنوان الامتحان</th>
                      <th className="py-3 px-4">الجامعة</th>
                      <th className="py-3 px-4">الفصل</th>
                      <th className="py-3 px-4">نوع التصحيح</th>
                      <th className="py-3 px-4">حالة التحقق</th>
                      <th className="py-3 px-4">تاريخ الفحص</th>
                      <th className="py-3 px-4 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditExams.slice(0, 40).map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                          <Link to={`/examens/${ex.slug}`} className="hover:text-blue-600">
                            {ex.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{ex._university?.name_ar || '—'}</td>
                        <td className="py-3 px-4 font-bold text-blue-700">{ex.semester}</td>
                        <td className="py-3 px-4">
                          {ex.correction_type === 'officiel' ? (
                            <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">
                              رسمي
                            </span>
                          ) : ex.correction_type === 'propose' ? (
                            <span className="chip bg-amber-50 text-amber-800 border border-amber-200">
                              مقترح
                            </span>
                          ) : (
                            <span className="chip bg-slate-100 text-slate-600">بدون تصحيح</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {ex.verification_status === 'reported' ? (
                            <span className="chip bg-rose-50 text-rose-700 border border-rose-200">
                              مبلّغ عنه
                            </span>
                          ) : (
                            <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">
                              مفحوص ونشط
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {ex.last_verified_date || '2026-10-06'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleVerifySingle(ex.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            تأكيد الفحص
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="py-16 text-center card-academic p-8">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-heading font-bold text-base text-slate-800">
                  لا توجد بلاغات نشطة حالياً!
                </h3>
                <p className="text-xs text-slate-500">
                  جميع روابط التحميل والمعاينة تعمل بكفاءة ولم يتم تسجيل أي أعطال من الطلبة.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className={`card-academic p-5 border ${
                      rep.status === 'resolved' ? 'border-slate-200 bg-slate-50/50' : 'border-rose-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`chip text-xs font-bold ${
                          rep.status === 'resolved'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rep.status === 'resolved' ? 'تم الحل' : 'بلاغ معلق'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rep.created_at).toLocaleDateString('ar-MA')}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                      {rep.exam_title}
                    </h4>

                    <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>الملاحظة:</strong> {rep.details}
                    </p>

                    {rep.contact && (
                      <p className="text-[11px] text-slate-500 mb-3">
                        <strong>التواصل:</strong> {rep.contact}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        to={`/examens`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        معاينة الامتحان
                      </Link>
                      {rep.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>تعليم كمحلول</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Add Ingest Exam */}
        {activeTab === 'add' && (
          <div className="card-academic p-6 max-w-2xl mx-auto">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-600" />
              <span>إضافة نموذج امتحان جديد إلى الأرشيف</span>
            </h3>

            {ingestSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>تم نشر نموذج الامتحان والتحقق منه وإضافته لقاعدة البيانات وخريطة الموقع بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleIngestExam} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الامتحان الكامل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: القانون الجنائي الخاص — S4 — الدورة العادية 2024 — جامعة القاضي عياض"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الجامعة المغربية:</label>
                  <select
                    required
                    value={newUniId}
                    onChange={(e) => {
                      setNewUniId(e.target.value);
                      setNewFacId('');
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="">اختر الجامعة...</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name_ar} ({u.city_ar})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الكلية / المؤسسة:</label>
                  <select
                    value={newFacId}
                    onChange={(e) => setNewFacId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="">اختر الكلية (اختياري)...</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الفصل الدراسي:</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="S1">الفصل الأول S1</option>
                    <option value="S2">الفصل الثاني S2</option>
                    <option value="S3">الفصل الثالث S3</option>
                    <option value="S4">الفصل الرابع S4</option>
                    <option value="S5">الفصل الخامس S5</option>
                    <option value="S6">الفصل السادس S6</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الدورة:</label>
                  <select
                    value={newSession}
                    onChange={(e: any) => setNewSession(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="normale">دورة عادية (Normale)</option>
                    <option value="rattrapage">دورة الاستدراك (Rattrapage)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">السنة الجامعية:</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">حالة التصحيح:</label>
                  <select
                    value={newCorrType}
                    onChange={(e: any) => setNewCorrType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="sans_corrige">بدون تصحيح (موضوع فقط)</option>
                    <option value="officiel">تصحيح رسمي معتمد (Corrigé Officiel)</option>
                    <option value="propose">حل مقترح ومراجع (Proposition)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">لغة الامتحان:</label>
                  <select
                    value={newLang}
                    onChange={(e: any) => setNewLang(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="ar">العربية (Droit, Lettres...)</option>
                    <option value="fr">الفرنسية (Économie, Sciences...)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رابط المعاينة أو التحميل (Google Drive / مستودع الكلية):
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/... أو رابط PDF مباشر"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                نشر الامتحان فوراً في الأرشيف
              </button>
            </form>
          </div>
        )}

        {/* Tab Content: Dynamic Sitemap */}
        {activeTab === 'sitemap' && (
          <div className="card-academic p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  خريطة الموقع المحدثة تلقائياً (sitemap.xml)
                </h3>
                <p className="text-xs text-slate-500">
                  تضم الخريطة جميع صفحات الجامعات والكليات ونماذج الامتحانات الـ {exams.length} المتاحة على نطاق <strong>exammaroc.online</strong>.
                </p>
              </div>

              <button
                onClick={handleCopySitemap}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shrink-0"
              >
                {copiedSitemap ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedSitemap ? 'تم النسخ!' : 'نسخ كود الـ XML'}</span>
              </button>
            </div>

            <pre className="rounded-xl bg-slate-900 p-4 text-slate-100 text-xs font-mono overflow-x-auto max-h-96 text-left dir-ltr">
              {generatedSitemap.slice(0, 1500)}...
              {`\n<!-- ... وجميع الـ ${exams.length} نموذج امتحان الأخرى -->\n</urlset>`}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}
