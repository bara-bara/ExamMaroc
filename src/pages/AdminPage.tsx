import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Search,
  School,
  Layers,
  BookOpen,
  FileText,
  Download,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Faculty, Program, Subject, Exam } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

type Tab = 'overview' | 'exams' | 'universities' | 'faculties' | 'programs' | 'subjects';

const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({
    universities: 0,
    faculties: 0,
    programs: 0,
    subjects: 0,
    exams: 0,
    downloads: 0,
  });

  const [exams, setExams] = useState<EnrichedExam[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [examSearch, setExamSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Partial<Exam> & { tagsString?: string }>({});

  const reloadData = () => {
    setStats(StorageService.getStats());
    setExams(StorageService.getExams());
    setUniversities(StorageService.getUniversities());
    setFaculties(StorageService.getFaculties());
    setPrograms(StorageService.getPrograms());
    setSubjects(StorageService.getSubjects());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingExam({
      title: '',
      university_id: universities[0]?.id || '',
      semester: 'S1',
      session: 'normale',
      year: new Date().getFullYear(),
      source_url: '',
      tagsString: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: EnrichedExam) => {
    setEditingExam({
      ...exam,
      tagsString: (exam.tags || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
      StorageService.deleteExam(id);
      reloadData();
    }
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam.title || !editingExam.university_id) {
      alert('يرجى ملء عنوان الامتحان واختيار الجامعة');
      return;
    }

    const tags = (editingExam.tagsString || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    StorageService.saveExam({
      ...editingExam,
      tags,
    });

    setIsModalOpen(false);
    reloadData();
  };

  const filteredExams = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(examSearch.toLowerCase()) ||
      (e._university?.name_ar || '').includes(examSearch) ||
      (e._subject?.name_fr || '').toLowerCase().includes(examSearch.toLowerCase())
  );

  return (
    <>
      <SEO
        title="لوحة تحكم المشرفين - ExamMaroc"
        description="إدارة الجامعات والكليات والشعب والمواد ونماذج الامتحانات على منصة ExamMaroc."
        canonical="https://exammaroc.app/admin"
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'لوحة التحكم' },
          ]}
        />

        <header className="mt-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                لوحة تحكم المشرفين
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              إدارة المحتوى الأكاديمي، الجامعات، ونماذج الامتحانات المتاحة على المنصة.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة امتحان جديد</span>
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: ShieldCheck },
            { id: 'exams', label: `الامتحانات (${stats.exams})`, icon: FileText },
            { id: 'universities', label: `الجامعات (${stats.universities})`, icon: School },
            { id: 'faculties', label: `الكليات (${stats.faculties})`, icon: School },
            { id: 'programs', label: `الشعب (${stats.programs})`, icon: Layers },
            { id: 'subjects', label: `المواد (${stats.subjects})`, icon: BookOpen },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: 'الجامعات', val: stats.universities, icon: School, color: 'text-blue-600 bg-blue-50' },
                { label: 'الكليات', val: stats.faculties, icon: School, color: 'text-sky-600 bg-sky-50' },
                { label: 'الشعب', val: stats.programs, icon: Layers, color: 'text-purple-600 bg-purple-50' },
                { label: 'المواد', val: stats.subjects, icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'الامتحانات', val: stats.exams, icon: FileText, color: 'text-amber-600 bg-amber-50' },
                { label: 'التحميلات', val: stats.downloads, icon: Download, color: 'text-rose-600 bg-rose-50' },
              ].map((card) => (
                <div key={card.label} className="card-academic p-5 text-center space-y-2">
                  <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-slate-900">
                    {card.val}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Uploads */}
            <div className="card-academic p-6 bg-white space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                أحدث الامتحانات المضافة في النظام
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="py-2.5 px-3">العنوان</th>
                      <th className="py-2.5 px-3">الجامعة</th>
                      <th className="py-2.5 px-3">الفصل</th>
                      <th className="py-2.5 px-3">السنة</th>
                      <th className="py-2.5 px-3">التحميلات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exams.slice(0, 5).map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-800">{e.title}</td>
                        <td className="py-3 px-3 text-slate-500">{e._university?.name_ar}</td>
                        <td className="py-3 px-3 font-bold text-blue-600">{e.semester}</td>
                        <td className="py-3 px-3 text-slate-600">{e.year}</td>
                        <td className="py-3 px-3 text-emerald-600 font-bold">{e.download_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Exams CRUD */}
        {activeTab === 'exams' && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="بحث في الامتحانات..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <span className="text-xs text-slate-500 font-medium">
                إجمالي: {filteredExams.length} امتحان
              </span>
            </div>

            <div className="card-academic overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">عنوان الامتحان</th>
                      <th className="py-3.5 px-3 font-bold">الجامعة</th>
                      <th className="py-3.5 px-3 font-bold">الفصل</th>
                      <th className="py-3.5 px-3 font-bold">الدورة</th>
                      <th className="py-3.5 px-3 font-bold">السنة</th>
                      <th className="py-3.5 px-3 font-bold">التحميلات</th>
                      <th className="py-3.5 px-4 font-bold text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExams.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                          {e.title}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">{e._university?.name_ar}</td>
                        <td className="py-3.5 px-3 font-bold text-blue-700">{e.semester}</td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {e.session === 'normale' ? 'عادية' : 'استدراك'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 font-medium">{e.year}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">{e.download_count}</td>
                        <td className="py-3.5 px-4 text-left space-x-1.5 space-x-reverse">
                          <button
                            onClick={() => handleOpenEdit(e)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExam(e.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Tab 3: Universities List */}
        {activeTab === 'universities' && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => (
              <div key={u.id} className="card-academic p-5 space-y-2">
                <h3 className="font-heading font-bold text-slate-900">{u.name_ar}</h3>
                <p className="text-xs text-slate-500">{u.name_fr}</p>
                <p className="text-xs text-blue-600 font-medium">{u.city_ar} · {u.city}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Faculties List */}
        {activeTab === 'faculties' && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculties.map((f) => (
              <div key={f.id} className="card-academic p-5 space-y-1">
                <h3 className="font-heading font-bold text-slate-900">{f.name_ar}</h3>
                <p className="text-xs text-slate-500">{f.name_fr}</p>
                <p className="text-[11px] text-slate-400">الرمز: {f.slug}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Programs List */}
        {activeTab === 'programs' && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div key={p.id} className="card-academic p-5 space-y-1">
                <h3 className="font-heading font-bold text-slate-900">{p.name_fr}</h3>
                <p className="text-xs text-slate-500">{p.name_ar}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Subjects List */}
        {activeTab === 'subjects' && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <div key={s.id} className="card-academic p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{s.name_fr}</h3>
                  <p className="text-[11px] text-slate-500">{s.name_ar}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{s.slug}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {editingExam.id ? 'تعديل نموذج الامتحان' : 'إضافة نموذج امتحان جديد'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان الامتحان *
                </label>
                <input
                  required
                  type="text"
                  value={editingExam.title || ''}
                  onChange={(e) => setEditingExam({ ...editingExam, title: e.target.value })}
                  placeholder="مثال: Examen Microéconomie 1 — S1"
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الجامعة *</label>
                  <select
                    value={editingExam.university_id || ''}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, university_id: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الشعبة</label>
                  <select
                    value={editingExam.program_id || ''}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, program_id: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="">(اختياري)</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name_fr} - {p.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الفصل</label>
                  <select
                    value={editingExam.semester || 'S1'}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, semester: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الدورة</label>
                  <select
                    value={editingExam.session || 'normale'}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, session: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="normale">دورة عادية</option>
                    <option value="rattrapage">دورة الاستدراك</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السنة</label>
                  <input
                    type="number"
                    value={editingExam.year || 2023}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, year: parseInt(e.target.value) || 2023 })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المادة الدراسية (Subject)
                </label>
                <select
                  value={editingExam.subject_id || ''}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, subject_id: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">(اختياري / عام)</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name_fr} ({sub.name_ar})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رابط تحميل PDF (Google Drive أو رابط مباشر)
                </label>
                <input
                  type="url"
                  value={editingExam.source_url || ''}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, source_url: e.target.value })
                  }
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الكلمات المفتاحية (Tags مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={editingExam.tagsString || ''}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, tagsString: e.target.value })
                  }
                  placeholder="Microéconomie, S1, Rabat, 2023"
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={editingExam.description || ''}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, description: e.target.value })
                  }
                  placeholder="تفاصيل عن نموذج الامتحان..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
