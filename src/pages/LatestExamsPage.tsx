import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StorageService, EnrichedExam } from '../services/storageService';
import { University, Subject } from '../data/initialData';
import Breadcrumbs from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

export default function LatestExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState<EnrichedExam[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const selectedUni = searchParams.get('uni') || '';
  const selectedSemester = searchParams.get('semester') || '';
  const selectedSubject = searchParams.get('subject') || '';

  useEffect(() => {
    setExams(StorageService.getExams({ limit: 100 }));
    setUniversities(StorageService.getUniversities());
    setSubjects(StorageService.getSubjects());
  }, []);

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      if (selectedUni && e.university_id !== selectedUni) return false;
      if (selectedSemester && e.semester !== selectedSemester) return false;
      if (selectedSubject && e.subject_id !== selectedSubject) return false;
      return true;
    });
  }, [exams, selectedUni, selectedSemester, selectedSubject]);

  const updateFilter = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  return (
    <>
      <SEO
        title="آخر الامتحانات المضافة - نماذج حديثة بصيغة PDF | ExamMaroc"
        description="أحدث نماذج الامتحانات المضافة إلى منصة ExamMaroc. تصفح حسب الجامعة والفصل والمادة وحمّل بصيغة PDF."
        canonical="https://exammaroc.app/latest-exams"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'آخر الامتحانات', url: '/latest-exams' },
        ]}
      />

      <div className="container-academic py-8">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'آخر الامتحانات' },
          ]}
        />

        <header className="mt-4 mb-6">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            آخر الامتحانات المضافة
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {filteredExams.length} امتحان متاح للتحميل المباشر
          </p>
        </header>

        {/* Filter dropdowns */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <select
            value={selectedUni}
            onChange={(e) => updateFilter('uni', e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="">كل الجامعات</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name_ar}
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => updateFilter('semester', e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="">كل الفصول</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => updateFilter('subject', e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="">كل المواد</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name_fr} - {sub.name_ar}
              </option>
            ))}
          </select>
        </div>

        {/* Grid of Exams */}
        {filteredExams.length === 0 ? (
          <div className="card-academic p-12 text-center text-slate-500">
            لم نعثر على امتحانات تطابق التصفية المختارة.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        <AdSlot />
      </div>
    </>
  );
}
