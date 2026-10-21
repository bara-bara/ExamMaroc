import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  TrendingUp,
  Atom,
  BookA,
  School,
  Calendar,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

interface KeywordGroup {
  id: string;
  title: string;
  icon: any;
  color: string;
  badge: string;
  description: string;
  items: { label: string; query: string; semester?: string }[];
}

export const KEYWORD_CLUSTERS: KeywordGroup[] = [
  {
    id: 'droit',
    title: 'امتحانات شعبة القانون باللغة العربية (S1 - S6)',
    icon: Scale,
    color: 'emerald',
    badge: 'الأكثر طلباً بالمغرب',
    description: 'جميع نماذج امتحانات كليات العلوم القانونية والاقتصادية والاجتماعية (FSJES) مع عناصر الإجابة والتصحيح النموذجي PDF:',
    items: [
      { label: 'المدخل لدراسة القانون S1', query: 'المدخل لدراسة القانون', semester: 'S1' },
      { label: 'المدخل للشريعة الإسلامية S1', query: 'المدخل للشريعة الإسلامية', semester: 'S1' },
      { label: 'المدخل للعلوم السياسية S1', query: 'المدخل للعلوم السياسية', semester: 'S1' },
      { label: 'المدخل للعلاقات الدولية S1', query: 'المدخل للعلاقات الدولية', semester: 'S1' },
      { label: 'مناهج العلوم القانونية S1', query: 'مناهج العلوم القانونية', semester: 'S1' },
      { label: 'النظرية العامة للالتزامات والعقود S2', query: 'الالتزامات والعقود', semester: 'S2' },
      { label: 'القانون الجنائي العام S2', query: 'القانون الجنائي العام', semester: 'S2' },
      { label: 'القانون الدستوري والأنظمة السياسية S2', query: 'القانون الدستوري', semester: 'S2' },
      { label: 'القانون التجاري الأساسي S2', query: 'القانون التجاري', semester: 'S2' },
      { label: 'القانون الإداري والتنظيم الإداري S2', query: 'القانون الإداري', semester: 'S2' },
      { label: 'المسؤولية المدنية S3', query: 'المسؤولية المدنية', semester: 'S3' },
      { label: 'المسطرة المدنية S3', query: 'المسطرة المدنية', semester: 'S3' },
      { label: 'المسطرة الجنائية S3', query: 'المسطرة الجنائية', semester: 'S3' },
      { label: 'قانون الأسرة S3', query: 'قانون الأسرة', semester: 'S3' },
      { label: 'قانون الشغل والضمان الاجتماعي S3', query: 'قانون الشغل', semester: 'S3' },
      { label: 'القانون الجنائي الخاص S4', query: 'القانون الجنائي الخاص', semester: 'S4' },
      { label: 'قانون الشركات التجارية S4', query: 'قانون الشركات', semester: 'S4' },
      { label: 'التنظيم القضائي للمملكة S4', query: 'التنظيم القضائي', semester: 'S4' },
      { label: 'حقوق الإنسان والحريات العامة S4', query: 'حقوق الإنسان', semester: 'S4' },
      { label: 'صعوبات المقاولة S5', query: 'صعوبات المقاولة', semester: 'S5' },
      { label: 'القانون العقاري والحقوق العينية S5', query: 'القانون العقاري', semester: 'S5' },
      { label: 'العقود الخاصة S5', query: 'العقود الخاصة', semester: 'S5' },
      { label: 'المواريث والتركات والوصايا S6', query: 'المواريث والتركات', semester: 'S6' },
      { label: 'القانون الدولي الخاص S6', query: 'القانون الدولي الخاص', semester: 'S6' },
    ]
  },
  {
    id: 'economie',
    title: 'امتحانات شعبة الاقتصاد والتدبير (S1 - S6)',
    icon: TrendingUp,
    color: 'blue',
    badge: 'Sciences Éco & Gestion',
    description: 'نماذج امتحانات الاقتصاد والتسيير والمحاسبة بجميع كليات المغرب مع عناصر الإجابة والحلول:',
    items: [
      { label: 'Microéconomie 1 S1', query: 'Microéconomie', semester: 'S1' },
      { label: 'Macroéconomie 1 S1', query: 'Macroéconomie', semester: 'S1' },
      { label: 'Comptabilité Générale 1 S1', query: 'Comptabilité Générale', semester: 'S1' },
      { label: 'Management 1 S1', query: 'Management', semester: 'S1' },
      { label: 'Statistique Descriptive S1', query: 'Statistique Descriptive', semester: 'S1' },
      { label: 'Analyse Mathématique S1', query: 'Analyse Mathématique', semester: 'S1' },
      { label: 'Microéconomie 2 S2', query: 'Microéconomie', semester: 'S2' },
      { label: 'Macroéconomie 2 S2', query: 'Macroéconomie', semester: 'S2' },
      { label: 'Comptabilité Générale 2 S2', query: 'Comptabilité Générale', semester: 'S2' },
      { label: 'Algèbre S2', query: 'Algèbre', semester: 'S2' },
      { label: 'Économie Monétaire 1 S3', query: 'Économie Monétaire', semester: 'S3' },
      { label: 'Comptabilité Analytique S3', query: 'Comptabilité Analytique', semester: 'S3' },
      { label: 'Échantillonnage et Estimation S3', query: 'Échantillonnage', semester: 'S3' },
      { label: 'Marketing Fondamental S3', query: 'Marketing', semester: 'S3' },
      { label: 'Analyse Financière S4', query: 'Analyse Financière', semester: 'S4' },
      { label: 'Droit des Affaires S4', query: 'Droit des Affaires', semester: 'S4' },
      { label: 'Fiscalité des Entreprises S5', query: 'Fiscalité', semester: 'S5' },
      { label: 'Gestion Financière S5', query: 'Gestion Financière', semester: 'S5' },
      { label: 'Gestion des Ressources Humaines S5', query: 'GRH', semester: 'S5' },
      { label: 'Audit et Contrôle de Gestion S6', query: 'Audit', semester: 'S6' },
      { label: 'Stratégie d\'Entreprise S6', query: 'Stratégie', semester: 'S6' },
    ]
  },
  {
    id: 'sciences',
    title: 'امتحانات كليات العلوم والتقنيات (FSA, FS, FST)',
    icon: Atom,
    color: 'purple',
    badge: 'SMIA, SMPC, SVT, Informatique',
    description: 'نماذج امتحانات الرياضيات، الفيزياء، الكيمياء، والإعلاميات مع التمارين المحلولة:',
    items: [
      { label: 'Analyse 1 S1', query: 'Analyse', semester: 'S1' },
      { label: 'Algèbre 1 S1', query: 'Algèbre', semester: 'S1' },
      { label: 'Mécanique du Point S1', query: 'Mécanique', semester: 'S1' },
      { label: 'Thermodynamique S1', query: 'Thermodynamique', semester: 'S1' },
      { label: 'Atomistique et Liaisons Chimiques S1', query: 'Atomistique', semester: 'S1' },
      { label: 'Algorithmique et Langage C S2', query: 'Algorithmique', semester: 'S2' },
      { label: 'Électromagnétisme S3', query: 'Électromagnétisme', semester: 'S3' },
      { label: 'Optique Ondulatoire S3', query: 'Optique', semester: 'S3' },
      { label: 'Bases de Données (SQL) S3', query: 'Bases de Données', semester: 'S3' },
      { label: 'Programmation Orientée Objet (POO) S4', query: 'Programmation', semester: 'S4' },
      { label: 'Structures de Données S4', query: 'Structures de Données', semester: 'S4' },
    ]
  },
  {
    id: 'lettres',
    title: 'امتحانات الدراسات الإنجليزية والآداب (FLSH)',
    icon: BookA,
    color: 'amber',
    badge: 'English Studies & FLSH',
    description: 'امتحانات مسالك الدراسات الإنجليزية والفرنسية والآداب والعلوم الإنسانية:',
    items: [
      { label: 'Reading Comprehension S1', query: 'Reading Comprehension', semester: 'S1' },
      { label: 'Grammar 1 S1', query: 'Grammar', semester: 'S1' },
      { label: 'Paragraph Writing S1', query: 'Writing', semester: 'S1' },
      { label: 'Spoken English & Pronunciation S1', query: 'Spoken English', semester: 'S1' },
      { label: 'Guided Reading S2', query: 'Reading', semester: 'S2' },
      { label: 'Grammar 2 S2', query: 'Grammar', semester: 'S2' },
      { label: 'Composition S2', query: 'Composition', semester: 'S2' },
      { label: 'Introduction to Literature S3', query: 'Literature', semester: 'S3' },
      { label: 'Linguistics & Phonetics S4', query: 'Linguistics', semester: 'S4' },
    ]
  },
  {
    id: 'universites',
    title: 'امتحانات الجامعات المغربية الـ 12 والكليات الكبرى',
    icon: School,
    color: 'rose',
    badge: 'البحث حسب الجامعة',
    description: 'تصفح النماذج الرسمية بحسب الجامعة والمدينة والكلية:',
    items: [
      { label: 'جامعة ابن زهر أكادير (UIZ)', query: 'جامعة ابن زهر' },
      { label: 'كلية الحقوق أكادير (FSJES Agadir)', query: 'FSJES Agadir' },
      { label: 'القطب الجامعي أيت ملول (CUAM / FSJESAM)', query: 'أيت ملول' },
      { label: 'كلية الآداب ابن زهر (FLSH Agadir)', query: 'FLSH Agadir' },
      { label: 'كلية العلوم أكادير (FSA)', query: 'FSA' },
      { label: 'جامعة محمد الخامس الرباط (أكدال والسويسي)', query: 'جامعة محمد الخامس' },
      { label: 'جامعة الحسن الثاني الدار البيضاء (عين الشق والمحمدية)', query: 'جامعة الحسن الثاني' },
      { label: 'جامعة القاضي عياض مراكش (الداوديات والسملالية)', query: 'جامعة القاضي عياض' },
      { label: 'جامعة سيدي محمد بن عبد الله فاس (ظهر المهراز)', query: 'جامعة سيدي محمد بن عبد الله' },
      { label: 'جامعة عبد المالك السعدي طنجة تطوان', query: 'جامعة عبد المالك السعدي' },
      { label: 'جامعة مولاي إسماعيل مكناس والرشيدية', query: 'جامعة مولاي إسماعيل' },
      { label: 'جامعة محمد الأول وجدة والناظور', query: 'جامعة محمد الأول' },
      { label: 'جامعة ابن طفيل القنيطرة', query: 'جامعة ابن طفيل' },
      { label: 'جامعة شعيب الدكالي الجديدة', query: 'جامعة شعيب الدكالي' },
      { label: 'جامعة السلطان مولاي سليمان بني ملال', query: 'جامعة السلطان مولاي سليمان' },
      { label: 'جامعة الحسن الأول سطات وبرشيد', query: 'جامعة الحسن الأول' },
    ]
  },
  {
    id: 'guides',
    title: 'دليل الامتحانات، استدعاء أبوجي والرزنامة 2026',
    icon: Calendar,
    color: 'teal',
    badge: 'خدمات وإرشادات الطالب',
    description: 'أهم الاستفسارات التي يبحث عنها الطلاب والتلاميذ في محركات البحث:',
    items: [
      { label: 'سحب استدعاء الامتحانات ابن زهر Apogee', query: 'استدعاء امتحانات ابن زهر' },
      { label: 'طريقة استخراج استدعاء الامتحانات CNE مسار', query: 'استدعاء الامتحانات' },
      { label: 'موعد امتحانات الدورة الربيعية 2026', query: 'الدورة الربيعية 2026' },
      { label: 'تواريخ امتحانات الدورة الخريفية 2026', query: 'الدورة الخريفية' },
      { label: 'نماذج امتحانات مباريات الماستر بالمغرب', query: 'مباريات الماستر' },
      { label: 'امتحانات الدورة العادية والاستدراكية (Rattrapage)', query: 'استدراك' },
      { label: 'عناصر الإجابة وسلم التنقيط المعتمد', query: 'التصحيح' },
    ]
  }
];

export default function StudentKeywordsHub() {
  const [activeTab, setActiveTab] = useState<string>('droit');

  const currentGroup = KEYWORD_CLUSTERS.find(g => g.id === activeTab) || KEYWORD_CLUSTERS[0];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/90 p-4 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>بنك الكلمات المفتاحية ومستودع الامتحانات الأكثر بحثاً بالمغرب</span>
          </div>
          <h2 className="font-heading text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            دليل الطلاب والتلاميذ: ابحث عن امتحانات مادتك وكليتك مباشرة
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            فهرس ذكي يجمع أهم المواد والشعب والكليات التي يبحث عنها آلاف الطلاب الجامعيين في محركات البحث يومياً.
          </p>
        </div>

        <Link
          to="/examens"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 self-start sm:self-auto shrink-0"
        >
          <span>تصفح الفهرس الشامل (722+ امتحان)</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {KEYWORD_CLUSTERS.map((group) => {
          const Icon = group.icon;
          const isActive = group.id === activeTab;
          return (
            <button
              key={group.id}
              onClick={() => setActiveTab(group.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{group.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {currentGroup.description}
          </p>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {currentGroup.badge}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {currentGroup.items.map((item, idx) => (
            <Link
              key={idx}
              to={
                item.semester
                  ? `/examens?semester=${item.semester}&q=${encodeURIComponent(item.query)}`
                  : `/search?q=${encodeURIComponent(item.query)}`
              }
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-right shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 truncate">
                  {item.label}
                </span>
              </div>
              {item.semester && (
                <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-700 shrink-0">
                  {item.semester}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
