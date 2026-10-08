import {
  University,
  Faculty,
  Program,
  Subject,
  Exam,
  INITIAL_UNIVERSITIES,
  INITIAL_FACULTIES,
  INITIAL_PROGRAMS,
  INITIAL_SUBJECTS,
  INITIAL_EXAMS,
} from '../data/initialData';

const STORAGE_KEYS = {
  UNIVERSITIES: 'exammaroc_universities_v3',
  FACULTIES: 'exammaroc_faculties_v3',
  PROGRAMS: 'exammaroc_programs_v3',
  SUBJECTS: 'exammaroc_subjects_v3',
  EXAMS: 'exammaroc_exams_v3',
  REPORTS: 'exammaroc_reports_v1',
};

export interface ExamReport {
  id: string;
  exam_id: string;
  exam_title: string;
  issue_type: 'broken_link' | 'wrong_file' | 'missing_pages' | 'suggest_correction' | 'other';
  details: string;
  contact?: string;
  created_at: string;
  status: 'pending' | 'resolved';
}

function getStoredOrInit<T extends { id: string }>(key: string, initial: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Auto-merge: keep existing items + append any newly added initial items by id
      const existingIds = new Set(parsed.map((p: any) => p.id));
      let hasNew = false;
      const merged = [...parsed];
      for (const item of initial) {
        if (!existingIds.has(item.id)) {
          merged.push(item);
          hasNew = true;
        }
      }
      if (hasNew) {
        localStorage.setItem(key, JSON.stringify(merged));
      }
      return merged;
    }
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  } catch {
    return initial;
  }
}

function save<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export interface EnrichedExam extends Exam {
  _university?: University;
  _faculty?: Faculty;
  _program?: Program;
  _subject?: Subject;
}

export interface ExamFilters {
  university_id?: string;
  program_id?: string;
  faculty_id?: string;
  subject_id?: string;
  semester?: string;
  session?: string;
  year?: number | string;
  correction_type?: 'officiel' | 'propose' | 'sans_corrige' | 'all';
  has_correction?: boolean;
  language?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export class StorageService {
  private static getUniversitiesList(): University[] {
    return getStoredOrInit(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
  }

  private static getFacultiesList(): Faculty[] {
    return getStoredOrInit(STORAGE_KEYS.FACULTIES, INITIAL_FACULTIES);
  }

  private static getProgramsList(): Program[] {
    return getStoredOrInit(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
  }

  private static getSubjectsList(): Subject[] {
    return getStoredOrInit(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  }

  private static getExamsList(): Exam[] {
    return getStoredOrInit(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  }

  static getUniversities(): University[] {
    return this.getUniversitiesList();
  }

  static getUniversityBySlug(slug: string): University | undefined {
    return this.getUniversitiesList().find(
      (u) => u.slug.toLowerCase() === slug.toLowerCase()
    );
  }

  static getUniversityById(id: string): University | undefined {
    return this.getUniversitiesList().find((u) => u.id === id);
  }

  static getFaculties(universityId?: string): Faculty[] {
    const all = this.getFacultiesList();
    if (!universityId) return all;
    return all.filter((f) => f.university_id === universityId);
  }

  static getFacultyById(id: string): Faculty | undefined {
    return this.getFacultiesList().find((f) => f.id === id);
  }

  static getFacultyBySlug(uniSlugOrId: string, facSlug: string): Faculty | undefined {
    const uni = this.getUniversityBySlug(uniSlugOrId) || this.getUniversityById(uniSlugOrId);
    const all = this.getFacultiesList();
    return all.find((f) => f.slug.toLowerCase() === facSlug.toLowerCase() && (!uni || f.university_id === uni.id));
  }

  static getPrograms(universityId?: string, facultyId?: string): Program[] {
    let progs = this.getProgramsList();
    if (universityId) {
      progs = progs.filter((p) => p.university_id === universityId);
    }
    if (facultyId) {
      progs = progs.filter((p) => p.faculty_id === facultyId);
    }
    return progs;
  }

  static getProgramBySlug(uniIdOrSlug: string, progSlug: string): Program | undefined {
    const uni = this.getUniversityBySlug(uniIdOrSlug) || this.getUniversityById(uniIdOrSlug);
    const progs = this.getProgramsList();
    return progs.find(
      (p) =>
        p.slug.toLowerCase() === progSlug.toLowerCase() &&
        (!uni || p.university_id === uni.id)
    );
  }

  static getSubjects(programSlug?: string, semester?: string): Subject[] {
    let subs = this.getSubjectsList();
    if (programSlug) {
      subs = subs.filter(s => s.program_slug === programSlug);
    }
    if (semester) {
      subs = subs.filter(s => s.semester === semester);
    }
    return subs;
  }

  static getSubjectById(id: string): Subject | undefined {
    return this.getSubjectsList().find((s) => s.id === id);
  }

  static getSubjectBySlug(slug: string): Subject | undefined {
    return this.getSubjectsList().find(
      (s) => s.slug.toLowerCase() === slug.toLowerCase()
    );
  }

  static enrichExam(exam: Exam): EnrichedExam {
    const unis = this.getUniversitiesList();
    const facs = this.getFacultiesList();
    const progs = this.getProgramsList();
    const subs = this.getSubjectsList();

    return {
      ...exam,
      _university: unis.find((u) => u.id === exam.university_id),
      _faculty: facs.find((f) => f.id === exam.faculty_id),
      _program: progs.find((p) => p.id === exam.program_id),
      _subject: subs.find((s) => s.id === exam.subject_id),
    };
  }

  static enrichExams(exams: Exam[]): EnrichedExam[] {
    const unisMap = new Map(this.getUniversitiesList().map((u) => [u.id, u]));
    const facsMap = new Map(this.getFacultiesList().map((f) => [f.id, f]));
    const progsMap = new Map(this.getProgramsList().map((p) => [p.id, p]));
    const subsMap = new Map(this.getSubjectsList().map((s) => [s.id, s]));

    return exams.map((exam) => ({
      ...exam,
      _university: exam.university_id ? unisMap.get(exam.university_id) : undefined,
      _faculty: exam.faculty_id ? facsMap.get(exam.faculty_id) : undefined,
      _program: exam.program_id ? progsMap.get(exam.program_id) : undefined,
      _subject: exam.subject_id ? subsMap.get(exam.subject_id) : undefined,
    }));
  }

  static getExams(filters?: ExamFilters): EnrichedExam[] {
    let exams = this.getExamsList();

    if (filters) {
      if (filters.university_id) {
        exams = exams.filter((e) => e.university_id === filters.university_id);
      }
      if (filters.faculty_id) {
        exams = exams.filter((e) => e.faculty_id === filters.faculty_id);
      }
      if (filters.program_id) {
        exams = exams.filter((e) => e.program_id === filters.program_id);
      }
      if (filters.subject_id) {
        exams = exams.filter((e) => e.subject_id === filters.subject_id);
      }
      if (filters.semester) {
        exams = exams.filter((e) => e.semester === filters.semester);
      }
      if (filters.session) {
        exams = exams.filter((e) => e.session === filters.session);
      }
      if (filters.year) {
        exams = exams.filter((e) => String(e.year) === String(filters.year));
      }
      if (filters.has_correction !== undefined) {
        exams = exams.filter((e) =>
          filters.has_correction
            ? (e.has_correction || e.correction_type === 'officiel' || e.correction_type === 'propose')
            : (e.correction_type === 'sans_corrige' || !e.has_correction)
        );
      }
      if (filters.correction_type && filters.correction_type !== 'all') {
        exams = exams.filter((e) => e.correction_type === filters.correction_type);
      }
      if (filters.language) {
        exams = exams.filter((e) => e.language === filters.language || (filters.language === 'all'));
      }
      if (filters.search) {
        const q = filters.search.trim().toLowerCase();
        exams = exams.filter((e) => {
          const t = (e.title || '').toLowerCase();
          const d = (e.description || '').toLowerCase();
          const tags = (e.tags || []).map(x => x.toLowerCase()).join(' ');
          return t.includes(q) || d.includes(q) || tags.includes(q);
        });
      }
    }

    // Sort by year desc, then download_count desc
    exams.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.download_count || 0) - (a.download_count || 0));

    if (filters?.offset) {
      exams = exams.slice(filters.offset);
    }
    if (filters?.limit) {
      exams = exams.slice(0, filters.limit);
    }

    return this.enrichExams(exams);
  }

  static getCorrectedExams(filters?: ExamFilters): EnrichedExam[] {
    return this.getExams({
      ...filters,
      has_correction: true,
    });
  }

  static getExamBySlug(slug: string): EnrichedExam | undefined {
    const exam = this.getExamsList().find(
      (e) => e.slug.toLowerCase() === slug.toLowerCase()
    );
    if (!exam) return undefined;
    return this.enrichExam(exam);
  }

  static getRelatedExams(exam: Exam, limit = 6): EnrichedExam[] {
    const all = this.getExamsList().filter((e) => e.id !== exam.id);
    const scored = all.map((item) => {
      let score = 0;
      if (item.subject_id && item.subject_id === exam.subject_id) score += 6;
      if (item.program_id && item.program_id === exam.program_id) score += 4;
      if (item.semester === exam.semester) score += 2;
      if (item.university_id === exam.university_id) score += 2;
      if (item.correction_type !== 'sans_corrige') score += 1;
      return { exam: item, score };
    });

    scored.sort((a, b) => b.score - a.score || (b.exam.year || 0) - (a.exam.year || 0));
    return this.enrichExams(scored.slice(0, limit).map((s) => s.exam));
  }

  static incrementDownloadCount(id: string): number {
    const exams = this.getExamsList();
    const target = exams.find((e) => e.id === id);
    if (target) {
      target.download_count = (target.download_count || 0) + 1;
      save(STORAGE_KEYS.EXAMS, exams);
      return target.download_count;
    }
    return 0;
  }

  static liveSearchSuggestions(query: string) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const unis = this.getUniversitiesList();
    const subs = this.getSubjectsList();
    const progs = this.getProgramsList();

    const results: { label: string; type: 'university' | 'subject' | 'program'; slug: string; to: string }[] = [];

    unis.forEach((u) => {
      if (
        u.name_fr.toLowerCase().includes(q) ||
        u.name_ar.includes(query) ||
        u.city.toLowerCase().includes(q) ||
        u.city_ar.includes(query)
      ) {
        results.push({
          label: `${u.name_ar} (${u.city_ar})`,
          type: 'university',
          slug: u.slug,
          to: `/universites/${u.slug}`,
        });
      }
    });

    subs.forEach((s) => {
      if (s.name_fr.toLowerCase().includes(q) || s.name_ar.includes(query)) {
        results.push({
          label: `${s.name_ar} (${s.name_fr}) - ${s.semester || ''}`,
          type: 'subject',
          slug: s.slug,
          to: `/search?q=${encodeURIComponent(s.name_ar)}`,
        });
      }
    });

    progs.forEach((p) => {
      if (p.name_fr.toLowerCase().includes(q) || p.name_ar.includes(query)) {
        const uni = unis.find((u) => u.id === p.university_id);
        results.push({
          label: `${p.name_ar} - ${p.name_fr}`,
          type: 'program',
          slug: p.slug,
          to: uni ? `/universites/${uni.slug}/${p.slug}` : `/search?q=${encodeURIComponent(p.name_ar)}`,
        });
      }
    });

    return results.slice(0, 8);
  }

  static searchExams(query: string): EnrichedExam[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const exams = this.getExamsList();
    const unis = new Map(this.getUniversitiesList().map((u) => [u.id, u]));
    const progs = new Map(this.getProgramsList().map((p) => [p.id, p]));
    const subs = new Map(this.getSubjectsList().map((s) => [s.id, s]));

    const scored = exams
      .map((exam) => {
        let score = 0;
        const uni = exam.university_id ? unis.get(exam.university_id) : undefined;
        const prog = exam.program_id ? progs.get(exam.program_id) : undefined;
        const sub = exam.subject_id ? subs.get(exam.subject_id) : undefined;

        const title = (exam.title || '').toLowerCase();
        const desc = (exam.description || '').toLowerCase();
        const tags = (exam.tags || []).map((t) => t.toLowerCase()).join(' ');
        const semester = (exam.semester || '').toLowerCase();
        const year = String(exam.year || '');

        if (title.includes(q)) score += 20;
        if (tags.includes(q)) score += 12;
        if (sub && (sub.name_fr.toLowerCase().includes(q) || sub.name_ar.includes(query))) score += 15;
        if (prog && (prog.name_fr.toLowerCase().includes(q) || prog.name_ar.includes(query))) score += 10;
        if (uni && (uni.name_fr.toLowerCase().includes(q) || uni.name_ar.includes(query) || uni.city.toLowerCase().includes(q))) score += 10;
        if (semester === q) score += 10;
        if (year === q) score += 5;
        if (desc.includes(q)) score += 4;
        if (exam.has_correction) score += 1;

        return { exam, score, uni, prog, sub };
      })
      .filter((item) => item.score > 0);

    scored.sort((a, b) => b.score - a.score || (b.exam.year || 0) - (a.exam.year || 0));

    return scored.map((item) => ({
      ...item.exam,
      _university: item.uni,
      _program: item.prog,
      _subject: item.sub,
    }));
  }

  static getStats() {
    const unis = this.getUniversitiesList();
    const facs = this.getFacultiesList();
    const progs = this.getProgramsList();
    const subs = this.getSubjectsList();
    const exams = this.getExamsList();
    const downloads = exams.reduce((sum, e) => sum + (e.download_count || 0), 0);
    const correctedExams = exams.filter(e => e.has_correction || e.correction_type !== 'sans_corrige').length;

    return {
      universities: unis.length,
      faculties: facs.length,
      programs: progs.length,
      subjects: subs.length,
      exams: exams.length,
      correctedExams,
      downloads,
    };
  }

  // --- Reporting System ---
  static reportIssue(
    examId: string,
    examTitle: string,
    issueType: 'broken_link' | 'wrong_file' | 'missing_pages' | 'suggest_correction' | 'other',
    details: string,
    contact?: string
  ): ExamReport {
    let reports: ExamReport[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (raw) reports = JSON.parse(raw);
    } catch {}

    const newReport: ExamReport = {
      id: 'rep_' + Date.now(),
      exam_id: examId,
      exam_title: examTitle,
      issue_type: issueType,
      details,
      contact,
      created_at: new Date().toISOString(),
      status: 'pending',
    };

    reports.unshift(newReport);
    save(STORAGE_KEYS.REPORTS, reports);

    // If report is broken link, mark exam status as reported
    const exams = this.getExamsList();
    const target = exams.find(e => e.id === examId);
    if (target) {
      target.verification_status = 'reported';
      save(STORAGE_KEYS.EXAMS, exams);
    }

    return newReport;
  }

  static getReports(): ExamReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static resolveReport(reportId: string): boolean {
    let reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = 'resolved';
      save(STORAGE_KEYS.REPORTS, reports);
      return true;
    }
    return false;
  }

  static verifyExam(examId: string): boolean {
    const exams = this.getExamsList();
    const target = exams.find(e => e.id === examId);
    if (target) {
      target.verification_status = 'verified';
      target.last_verified_date = new Date().toISOString().split('T')[0];
      save(STORAGE_KEYS.EXAMS, exams);
      return true;
    }
    return false;
  }

  // Data mutation methods
  static saveExam(examData: Partial<Exam>): Exam {
    const exams = this.getExamsList();
    if (examData.id) {
      const idx = exams.findIndex((e) => e.id === examData.id);
      if (idx !== -1) {
        exams[idx] = {
          ...exams[idx],
          ...examData,
          updated_date: new Date().toISOString(),
        } as Exam;
        save(STORAGE_KEYS.EXAMS, exams);
        return exams[idx];
      }
    }

    const newExam: Exam = {
      id: 'exam_' + Date.now(),
      slug:
        examData.slug ||
        (examData.title || 'exam')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      title: examData.title || 'امتحان جديد',
      description: examData.description || '',
      university_id: examData.university_id || '',
      faculty_id: examData.faculty_id,
      program_id: examData.program_id,
      subject_id: examData.subject_id,
      semester: examData.semester || 'S1',
      session: examData.session || 'normale',
      year: examData.year || new Date().getFullYear(),
      download_count: 0,
      source_url: examData.source_url || '',
      file_name: examData.file_name,
      file_uri: examData.file_uri,
      correction_type: examData.correction_type || 'sans_corrige',
      has_correction: Boolean(examData.has_correction || examData.correction_type === 'officiel' || examData.correction_type === 'propose'),
      correction_notes: examData.correction_notes,
      verification_status: examData.verification_status || 'verified',
      last_verified_date: examData.last_verified_date || new Date().toISOString().split('T')[0],
      source_origin: examData.source_origin || 'المستودع الأكاديمي الرقمي',
      language: examData.language || 'ar',
      tags: examData.tags || [],
      seo_title: examData.seo_title,
      seo_description: examData.seo_description,
      status: 'published',
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };

    exams.unshift(newExam);
    save(STORAGE_KEYS.EXAMS, exams);
    return newExam;
  }

  static deleteExam(id: string): boolean {
    let exams = this.getExamsList();
    const initialLen = exams.length;
    exams = exams.filter((e) => e.id !== id);
    if (exams.length !== initialLen) {
      save(STORAGE_KEYS.EXAMS, exams);
      return true;
    }
    return false;
  }
}
