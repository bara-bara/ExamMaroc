import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Calendar,
  School,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  GraduationCap
} from 'lucide-react';
import { StorageService, EnrichedExam } from '../services/storageService';
import Breadcrumbs, { BreadcrumbItem } from '../components/Breadcrumbs';
import ExamCard from '../components/ExamCard';
import SEO from '../components/SEO';

interface DisciplineConfig {
  slug: string;
  name_ar: string;
  name_fr: string;
  badge: string;
  title: string;
  description: string;
  keywords: string[];
  modulesBySemester: Record<string, string[]>;
  matchFilter: (exam: EnrichedExam) => boolean;
  faqs: { question: string; answer: string }[];
}

const DISCIPLINE_CONFIGS: Record<string, DisciplineConfig> = {
  'droit-arabe': {
    slug: 'droit-arabe',
    name_ar: 'شعبة القانون باللغة العربية (Droit Arabe)',
    name_fr: 'Droit en Arabe',
    badge: 'كلية العلوم القانونية والاقتصادية والاجتماعية (FSJES)',
    title: 'امتحانات شعبة القانون باللغة العربية S1-S6 مع التصحيح PDF | ExamMaroc',
    description: 'أرشيف شامل لجميع نماذج امتحانات شعبة القانون باللغة العربية بجميع كليات الحقوق المغربية (FSJES) من الفصل الأول S1 إلى الفصل السادس S6 بصيغة PDF مع عناصر الإجابة والتصحيحات الرسمية مجاناً.',
    keywords: [
      'امتحانات شعبة القانون باللغة العربية',
      'امتحانات القانون S1 S2 S3 S4 S5 S6',
      'المدخل لدراسة القانون S1',
      'النظرية العامة للالتزامات والعقود S2',
      'القانون الجنائي المغربي',
      'القانون التجاري S4',
      'العقود الخاصة S5',
      'امتحانات كلية الحقوق مع التصحيح PDF',
    ],
    modulesBySemester: {
      S1: ['المدخل لدراسة العلوم القانونية', 'المدخل لدراسة الشريعة الإسلامية', 'المدخل للعلوم السياسية', 'المدخل للعلاقات الدولية', 'مدخل للعلوم الاقتصادية والتدبير'],
      S2: ['النظرية العامة للالتزامات والعقود', 'القانون الدستوري', 'التنظيم الإداري', 'القانون الجنائي العام', 'حقوق الإنسان والحريات العامة'],
      S3: ['المسؤولية المدنية', 'الأنظمة الدستورية المقارنة', 'النشاط الإداري', 'قانون الميزانية', 'قانون الأسرة'],
      S4: ['القانون التجاري الأساسي', 'القانون الجنائي الخاص', 'قانون الشركات', 'التنظيم القضائي', 'حقوق الإنسان'],
      S5: ['صعوبات المقاولة', 'العقود الخاصة', 'القانون الدولي الخاص', 'قانون التأمين', 'قانون الشغل'],
      S6: ['المسطرة المدنية', 'المسطرة الجنائية', 'القانون العقاري والضمانات', 'المنازعات الإدارية'],
    },
    matchFilter: (exam) => {
      const progSlug = exam._program?.slug || '';
      const progName = exam._program?.name_ar || '';
      const title = exam.title.toLowerCase();
      const tags = (exam.tags || []).join(' ').toLowerCase();

      return (
        progSlug.includes('droit') ||
        progName.includes('قانون') ||
        title.includes('قانون') ||
        title.includes('شريعة') ||
        title.includes('التزامات') ||
        title.includes('دستوري') ||
        title.includes('جنائي') ||
        title.includes('مدخل لدراسة') ||
        tags.includes('قانون') ||
        tags.includes('droit')
      );
    },
    faqs: [
      {
        question: 'كيف أحصل على امتحانات شعبة القانون باللغة العربية مع التصحيح الرسمي؟',
        answer: 'توفر منصة ExamMaroc نماذج امتحانات كليات الحقوق المغربية (FSJES فاس، الرباط، أكادير، مراكش، الدار البيضاء، طنجة...) مرفقة بعناصر الإجابة وسلم التنقيط المعتمد من الأساتذة بصيغة PDF مجاناً.',
      },
      {
        question: 'ما هي أهم المواد القانونية التي تتطلب نماذج امتحانات سابقة؟',
        answer: 'من أهم المواد التي تتطلب تدريباً مستمراً على النوازل والأسئلة النظرية: المدخل لدراسة القانون (S1)، الالتزامات والعقود (S2)، القانون الجنائي، قانون الشركات (S4)، والمسطرة المدنية والجنائية (S6).',
      },
      {
        question: 'هل صيغة PDF قابلة للطباعة المباشرة؟',
        answer: 'نعم، جميع أوراق الامتحانات جاهزة للطباعة والتنزيل المباشر أو المعاينة المباشرة دون إعلانات منبثقة أو روابط وهمية.',
      },
    ],
  },
  'economie-gestion': {
    slug: 'economie-gestion',
    name_ar: 'شعبة الاقتصاد والتدبير (Sciences Économiques et Gestion)',
    name_fr: 'Économie et Gestion',
    badge: 'كلية العلوم الاقتصادية (FSJES & ENCG)',
    title: 'امتحانات شعبة الاقتصاد والتدبير S1-S6 مع التصحيح PDF | ExamMaroc',
    description: 'تحميل جميع نماذج امتحانات شعبة الاقتصاد والتدبير (Économie & Gestion) من الفصل S1 إلى S6 لجميع الكليات والمدارس المغربية بصيغة PDF مع حلول التمارين وعناصر الإجابة الرسمية.',
    keywords: [
      'امتحانات الاقتصاد والتدبير S1 S2 S3 S4 S5 S6',
      'examens economie et gestion pdf maroc',
      'comptabilite generale s1 s2',
      'microeconomie s1 s2 examen corrige',
      'macroeconomie s2 examen',
      'analyse financiere s4 pdf',
      'statistiques s2 fsjes',
    ],
    modulesBySemester: {
      S1: ['Microéconomie I', 'Comptabilité Générale I', 'Management I', 'Statistique Descriptive', 'Introduction à l’Économie'],
      S2: ['Macroéconomie', 'Comptabilité Générale II', 'Management II', 'Probabilités', 'Mathématiques Financières'],
      S3: ['Économie Monétaire et Financière I', 'Comptabilité Analytique', 'Marketing de Base', 'Échantillonnage et Estimation'],
      S4: ['Économie Monétaire II', 'Analyse Financière', 'Comptabilité des Sociétés', 'Informatique de Gestion'],
      S5: ['Gestion des Ressources Humaines', 'Fiscalité d’Entreprise', 'Gestion Financière', 'Audit Général'],
      S6: ['Stratégie d’Entreprise', 'Commerce International', 'Contrôle de Gestion'],
    },
    matchFilter: (exam) => {
      const progSlug = exam._program?.slug || '';
      const progName = exam._program?.name_ar || '';
      const title = exam.title.toLowerCase();
      const tags = (exam.tags || []).join(' ').toLowerCase();

      return (
        progSlug.includes('eco') ||
        progSlug.includes('gestion') ||
        progName.includes('اقتصاد') ||
        progName.includes('تدبير') ||
        title.includes('comptabilit') ||
        title.includes('micro') ||
        title.includes('macro') ||
        title.includes('management') ||
        title.includes('statist') ||
        title.includes('financ') ||
        title.includes('fiscalit') ||
        title.includes('اقتصاد') ||
        tags.includes('économie') ||
        tags.includes('gestion')
      );
    },
    faqs: [
      {
        question: 'هل تتوفر حلول تمارين المحاسبة والاقتصاد الجزئي (Micro/Macro)؟',
        answer: 'نعم، تضم المنصة نماذج امتحانات المحاسبة العامة، الاقتصاد الجزئي، الإحصاء الوصفي، والرياضيات المالية مع الحلول الرياضية المفصلة وجداول القيود المحاسبية.',
      },
      {
        question: 'ما هي الجامعات المشمولة في امتحانات الاقتصاد؟',
        answer: 'تغطي المنصة كبرى كليات FSJES (عين الشق، السويسي، ابن زهر، القاضي عياض، الحسن الأول، عبد المالك السعدي) بالإضافة لنماذج مدارس التجارة والتسيير ENCG.',
      },
    ],
  },
  'sciences-technologies': {
    slug: 'sciences-technologies',
    name_ar: 'العلوم الدقيقة والتطبيقية (SMIA, SMP, SMC, SMA)',
    name_fr: 'Sciences et Technologies',
    badge: 'كليات العلوم وكليات العلوم والتقنيات (FS & FST)',
    title: 'امتحانات كليات العلوم والتقنيات SMIA SMP SMC مع الحلول PDF | ExamMaroc',
    description: 'أرشيف امتحانات كليات العلوم المغربية (FS & FST) لمسالك الرياضيات والإعلاميات SMIA والفيزياء SMP والكيمياء SMC من S1 إلى S6 بصيغة PDF مع عناصر الإجابة والحلول البرمجية والفيزيائية.',
    keywords: [
      'امتحانات كليات العلوم المغربية PDF',
      'examens smia s1 s2 s3 s4 fsa fsr fsm',
      'analyse 1 algebre 1 examens corriges',
      'algorithmique et langage c smia examen',
      'electrostatique et electrocinetique smp',
      'mecanique du point s1 examen corrige',
    ],
    modulesBySemester: {
      S1: ['Analyse 1', 'Algèbre 1', 'Mécanique du Point', 'Thermodynamique 1', 'Atomistique'],
      S2: ['Analyse 2', 'Algèbre 2', 'Électrostatique et Électrocinétique', 'Algorithmique & Langage C', 'Optique Géométrique'],
      S3: ['Analyse 3', 'Algèbre 3', 'Structure de Données', 'Électromagnétisme', 'Chimie Organique'],
      S4: ['Analyse 4', 'Systèmes d’Exploitation', 'Programmation Orientée Objet (Java/C++)', 'Optique Ondulatoire'],
      S5: ['Bases de Données', 'Réseaux Informatiques', 'Génie Logiciel', 'Physique Quantique'],
      S6: ['Intelligence Artificielle', 'Sécurité Informatique', 'Projet de Fin d’Études (PFE)'],
    },
    matchFilter: (exam) => {
      const progSlug = exam._program?.slug || '';
      const title = exam.title.toLowerCase();
      const tags = (exam.tags || []).join(' ').toLowerCase();

      return (
        progSlug.includes('science') ||
        progSlug.includes('smia') ||
        progSlug.includes('smp') ||
        progSlug.includes('info') ||
        title.includes('analyse') ||
        title.includes('algèbre') ||
        title.includes('algebre') ||
        title.includes('langage c') ||
        title.includes('algorith') ||
        title.includes('mecanique') ||
        title.includes('thermo') ||
        title.includes('physique') ||
        title.includes('chimie') ||
        tags.includes('smia') ||
        tags.includes('smp') ||
        tags.includes('sciences')
      );
    },
    faqs: [
      {
        question: 'هل تتضمن امتحانات SMIA الأكواد البرمجية للغة C والخوارزميات؟',
        answer: 'نعم، نماذج امتحانات الإعلاميات (Algorithmique & Langage C, POO Java) تشتمل على الأكواد الكاملة وشرح معالجة المؤشرات (Pointers) والمصفوفات الديناميكية وهياكل البيانات.',
      },
    ],
  },
  'etudes-anglaises': {
    slug: 'etudes-anglaises',
    name_ar: 'شعبة الدراسات الإنجليزية (English Studies - FLSH)',
    name_fr: 'English Studies',
    badge: 'كليات الآداب والعلوم الإنسانية (FLSH)',
    title: 'English Studies Semester Exams FLSH Morocco PDF with Keys | ExamMaroc',
    description: 'Download Moroccan University English Studies exams (S1, S2, S3, S4, S5, S6) with answer keys in PDF format. FLSH Ibn Zohr, Mohammed V, Hassan II, Cadi Ayyad.',
    keywords: [
      'English Studies Morocco exams PDF',
      'FLSH English exams S1 S2 S3 S4 S5 S6',
      'Reading Comprehension Writing exams',
      'Linguistics exams Moroccan universities',
      'British and American Literature exams FLSH',
      'Ibn Zohr English studies exams',
    ],
    modulesBySemester: {
      S1: ['Reading & Paragraph Writing', 'Grammar 1', 'Spoken English', 'Study Skills', 'Cultural Studies'],
      S2: ['Composition 1', 'Grammar 2', 'Oral Communication', 'Readings in Culture', 'Introduction to Literature'],
      S3: ['Composition 2', 'Introduction to Linguistics', 'British Literature 1', 'Public Speaking', 'Translation'],
      S4: ['Advanced Composition', 'Applied Linguistics', 'American Literature', 'Research Methodology'],
      S5: ['Morphology & Syntax', 'Literary Criticism', 'Postcolonial Literature', 'Discourse Analysis'],
      S6: ['Sociolinguistics', 'Semantics & Pragmatics', 'Capstone Project'],
    },
    matchFilter: (exam) => {
      const progSlug = exam._program?.slug || '';
      const title = exam.title.toLowerCase();
      const tags = (exam.tags || []).join(' ').toLowerCase();

      return (
        progSlug.includes('english') ||
        progSlug.includes('anglaise') ||
        title.includes('english') ||
        title.includes('grammar') ||
        title.includes('linguistics') ||
        title.includes('literature') ||
        tags.includes('english') ||
        tags.includes('anglais')
      );
    },
    faqs: [
      {
        question: 'Are answer keys provided for English Studies exams?',
        answer: 'Yes, multiple exams across Reading, Grammar, and Linguistics include official sample keys and guidelines provided by university professors.',
      },
    ],
  },
  'etudes-islamiques': {
    slug: 'etudes-islamiques',
    name_ar: 'شعبة الدراسات الإسلامية (Études Islamiques - FLSH)',
    name_fr: 'Études Islamiques',
    badge: 'كليات الآداب والعلوم الإنسانية وكلية أصول الدين (FLSH & Oussoul Eddine)',
    title: 'امتحانات شعبة الدراسات الإسلامية S1 مع التصحيح PDF | ExamMaroc',
    description: 'أرشيف نماذج امتحانات شعبة الدراسات الإسلامية بالجامعات المغربية للفصل الأول S1 وجميع الفصول بصيغة PDF مع عناصر الإجابة والتصحيح الرسمي مجاناً. كليات الآداب ابن زهر، القاضي عياض، محمد الخامس، وكلية أصول الدين بتطوان.',
    keywords: [
      'نماذج امتحانات شعبة الدراسات الإسلامية s1 pdf',
      'امتحانات الدراسات الإسلامية الفصل الأول S1 مع التصحيح',
      'امتحانات مدخل لدراسة الشريعة الإسلامية',
      'امتحانات علوم القرآن والحديث S1',
      'امتحانات العقيدة الإسلامية S1',
      'امتحانات السيرة النبوية FLSH',
      'امتحانات كلية الآداب شعبة الدراسات الإسلامية PDF',
    ],
    modulesBySemester: {
      S1: ['مدخل لدراسة الشريعة الإسلامية', 'علوم القرآن الكريم', 'علوم الحديث النبوي', 'العقيدة الإسلامية', 'السيرة النبوية وفقهها', 'اللغة العربية وفقه اللغة'],
      S2: ['أصول الفقه 1', 'التفسير ومناهجه', 'فقه العبادات', 'مناهج البحث في الدراسات الإسلامية', 'تاريخ الأديان'],
      S3: ['فقه المعاملات المالية', 'أصول الفقه 2', 'علوم الحديث التخصصية', 'مقاصد الشريعة', 'الفكر الإسلامي المعاصر'],
      S4: ['أحكام الأسرة (الزواج والطلاق)', 'المواريث والتركات والوصايا', 'القواعد الفقهية', 'فقه السيرة والجهاد'],
      S5: ['السياسة الشرعية', 'فقه النوازل والقضايا المعاصرة', 'تخريج الأحاديث ودراسة الأسانيد', 'الفلسفة الإسلامية'],
      S6: ['مشروع نهاية الدراسة (PFE)', 'الاجتهاد والإفتاء', 'الاقتصاد الإسلامي'],
    },
    matchFilter: (exam) => {
      const progSlug = exam._program?.slug || '';
      const progName = exam._program?.name_ar || '';
      const title = exam.title.toLowerCase();
      const tags = (exam.tags || []).join(' ').toLowerCase();

      return (
        progSlug.includes('islam') ||
        progName.includes('إسلام') ||
        title.includes('إسلام') ||
        title.includes('شريعة') ||
        title.includes('قرآن') ||
        title.includes('حديث') ||
        title.includes('سيرة نبوية') ||
        title.includes('عقيدة') ||
        tags.includes('islamic') ||
        tags.includes('إسلامية')
      );
    },
    faqs: [
      {
        question: 'كيف يمكنني تحميل نماذج امتحانات شعبة الدراسات الإسلامية S1 مع التصحيح بصيغة PDF؟',
        answer: 'يوفر موقع ExamMaroc تحميل مباشر وفوري لجميع نماذج امتحانات الدراسات الإسلامية للفصل الأول S1 وسائر الفصول بصيغة PDF مع عناصر الإجابة وسلم التنقيط المعتمد مجاناً وبدون أي روابط مختصرة.',
      },
      {
        question: 'ما هي أهم مواد الفصل الأول S1 في شعبة الدراسات الإسلامية؟',
        answer: 'يشتمل الفصل الأول S1 على 6 مواد أساسية: علوم القرآن، علوم الحديث، العقيدة الإسلامية، السيرة النبوية، مدخل للشريعة الإسلامية، واللغة العربية، ويُعد التدريب على نماذج الامتحانات السابقة أفضل وسيلة للتميز.',
      },
      {
        question: 'هل الامتحانات تشمل كليات الآداب وكلية أصول الدين بالمغرب؟',
        answer: 'نعم، الأرشيف يغطي نماذج كليات الآداب والعلوم الإنسانية (FLSH) بجامعة ابن زهر أكادير، القاضي عياض مراكش، محمد الخامس الرباط، كلية أصول الدين بتطوان وكليات فاس ومكناس ووجدة.',
      },
    ],
  },
};

export default function DisciplineLandingPage() {
  const { pathname } = useLocation();

  // Determine key from pathname e.g. /examens/droit-arabe -> 'droit-arabe'
  const currentKey = Object.keys(DISCIPLINE_CONFIGS).find((key) =>
    pathname.includes(key)
  ) || 'droit-arabe';

  const config = DISCIPLINE_CONFIGS[currentKey];

  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedCorrType, setSelectedCorrType] = useState<string>('all');
  const [selectedUni, setSelectedUni] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const allExams = useMemo(() => StorageService.getExams(), []);
  const universities = useMemo(() => StorageService.getUniversities(), []);

  // Filter exams belonging to this discipline
  const filteredExams = useMemo(() => {
    return allExams.filter((exam) => {
      // Must match discipline
      if (!config.matchFilter(exam)) return false;

      // Semester filter
      if (selectedSemester !== 'all' && exam.semester !== selectedSemester) {
        return false;
      }

      // University filter
      if (selectedUni && exam.university_id !== selectedUni) {
        return false;
      }

      // Correction filter
      if (selectedCorrType === 'officiel' && exam.correction_type !== 'officiel') return false;
      if (selectedCorrType === 'with_corr' && exam.correction_type === 'sans_corrige') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          exam.title.toLowerCase().includes(q) ||
          exam.description?.toLowerCase().includes(q) ||
          (exam._university?.name_ar || '').includes(searchQuery)
        );
      }

      return true;
    });
  }, [allExams, config, selectedSemester, selectedCorrType, selectedUni, searchQuery]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'الرئيسية', to: '/' },
    { label: 'الامتحانات', to: '/examens' },
    { label: config.name_ar },
  ];

  const canonicalUrl = `https://www.exammaroc.online/examens/${config.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      about: {
        '@type': 'Course',
        name: config.name_ar,
        alternateName: config.name_fr,
      },
    },
  ];

  return (
    <>
      <SEO
        title={config.title}
        description={config.description}
        canonical={canonicalUrl}
        keywords={config.keywords}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.to || canonicalUrl,
        }))}
        faqs={config.faqs}
        jsonLd={jsonLd}
      />

      <div className="container-academic py-6 sm:py-10">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <header className="mt-4 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{config.badge}</span>
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold leading-tight">
              {config.name_ar}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {config.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span>{filteredExams.length} نموذج متاح للتحميل</span>
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>نماذج مرفقة بالتصحيح وسلم التنقيط</span>
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>صيغة PDF نقية ومباشرة</span>
              </span>
            </div>
          </div>
        </header>

        {/* Semester Modules Guide */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span>مواد ومجزوءات الشعبة حسب الفصول الدراسية (S1 - S6)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(selectedSemester === sem ? 'all' : sem)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                  selectedSemester === sem
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-blue-700">{sem}</span>
                  {selectedSemester === sem && (
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                  {config.modulesBySemester[sem]?.[0] || 'المجزوءات'}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Filters and Search Bar */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن مادة أو أستاذ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-10 pl-3 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* University */}
            <div>
              <select
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
                aria-label="اختر الجامعة"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs sm:text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">جميع الجامعات</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Correction Type */}
            <div>
              <select
                value={selectedCorrType}
                onChange={(e) => setSelectedCorrType(e.target.value)}
                aria-label="نوع التصحيح"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs sm:text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="all">كافة النماذج (مصححة وبدون تصحيح)</option>
                <option value="with_corr">نماذج مرفقة بالتصحيح فقط</option>
                <option value="officiel">تصحيح رسمي معتمد فقط</option>
              </select>
            </div>
          </div>
        </section>

        {/* Exams Grid */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>
                امتحانات {config.name_ar} {selectedSemester !== 'all' ? `— الفصل ${selectedSemester}` : ''} ({filteredExams.length} نموذج)
              </span>
            </h2>
            {selectedSemester !== 'all' && (
              <button
                onClick={() => setSelectedSemester('all')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                عرض كافة الفصول
              </button>
            )}
          </div>

          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-3 font-heading font-bold text-base text-slate-800">
                لا توجد نماذج متطابقة مع هذه الفلاتر
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                جرب إزالة بعض الفلاتر لعرض كافة النماذج المتاحة لهذه الشعبة.
              </p>
              <button
                onClick={() => {
                  setSelectedSemester('all');
                  setSelectedCorrType('all');
                  setSelectedUni('');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                إلغاء جميع الفلاتر
              </button>
            </div>
          )}
        </section>

        {/* FAQs */}
        {config.faqs && config.faqs.length > 0 && (
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-heading text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span>الأسئلة المتكررة حول {config.name_ar}</span>
            </h2>
            <div className="space-y-3">
              {config.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-right font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/40 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
