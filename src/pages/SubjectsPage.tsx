import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Subject } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const subs = StorageService.getSubjects();
    const exams = StorageService.getExams();

    const counts: Record<string, number> = {};
    exams.forEach((e) => {
      if (e.subject_id) {
        counts[e.subject_id] = (counts[e.subject_id] || 0) + 1;
      }
    });

    // Sort by count descending
    subs.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));

    setSubjects(subs);
    setSubjectCounts(counts);
  }, []);

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name_ar.includes(searchTerm)
  );

  return (
    <>
      <SEO
        title="فهرس المواد الدراسية - نماذج امتحانات المواد الجامعية | ExamMaroc"
        description="تصفح المواد الدراسية المتوفرة على منصة ExamMaroc وابحث عن نماذج امتحاناتها السابقة بصيغة PDF لجميع الجامعات المغربية."
        canonical="https://exammaroc.app/subjects"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'المواد الدراسية', url: '/subjects' },
        ]}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'المواد الدراسية' },
          ]}
        />

        <header className="mt-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              المواد الدراسية (Matières)
            </h1>
            <p className="mt-2 text-slate-600">
              فهرس المواد الأكثر توفراً للامتحانات الجامعية بصيغة PDF.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative max-w-xs w-full">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="تصفية المواد..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((sub) => {
            const count = subjectCounts[sub.id] || 0;
            return (
              <Link
                key={sub.id}
                to={`/search?q=${encodeURIComponent(sub.name_fr)}`}
                className="card-academic p-5 flex items-center justify-between hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div className="truncate">
                    <p className="font-heading font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                      {sub.name_fr}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{sub.name_ar}</p>
                  </div>
                </div>

                <span className="chip bg-slate-100 text-slate-700 shrink-0 mr-2 text-xs font-semibold">
                  {count} امتحان
                </span>
              </Link>
            );
          })}
        </div>

        <AdSlot />
      </div>
    </>
  );
}
