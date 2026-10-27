import fs from 'fs';
import path from 'path';
import {
  INITIAL_UNIVERSITIES,
  INITIAL_FACULTIES,
  INITIAL_PROGRAMS,
  INITIAL_SUBJECTS,
  INITIAL_EXAMS,
  University,
  Faculty,
  Program,
  Subject,
  Exam
} from '../src/data/initialData';

const BASE_URL = 'https://www.exammaroc.online';
const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist! Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

const uniMap = new Map<string, University>(INITIAL_UNIVERSITIES.map(u => [u.id, u]));
const facMap = new Map<string, Faculty>(INITIAL_FACULTIES.map(f => [f.id, f]));
const progMap = new Map<string, Program>(INITIAL_PROGRAMS.map(p => [p.id, p]));
const subMap = new Map<string, Subject>(INITIAL_SUBJECTS.map(s => [s.id, s]));

// Helper to escape HTML characters
function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface RouteConfig {
  relativePath: string; // e.g. "examens/slug"
  url: string;
  title: string;
  description: string;
  keywords?: string;
  h1: string;
  breadcrumbs: { name: string; url: string }[];
  schemas: any[];
  bodyHtml: string;
}

function generateHtml(cfg: RouteConfig): string {
  let html = baseTemplate;

  // 1. Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(cfg.title)}</title>`);

  // 2. Replace Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(cfg.description)}" />`
  );

  // 3. Replace Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${cfg.url}" />`
  );

  // 4. Replace Open Graph
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(cfg.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(cfg.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${cfg.url}" />`
  );

  // 5. Build Breadcrumbs Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': cfg.breadcrumbs.map((b, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': b.name,
      'item': b.url
    }))
  };

  const allSchemas = [breadcrumbSchema, ...cfg.schemas];
  const schemaTags = allSchemas
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');

  html = html.replace('</head>', `${schemaTags}\n</head>`);

  // 6. Inject semantic HTML inside <div id="root"> only for sub-pages, keeping homepage clean to prevent FOUC flash
  const rootContent = `
    <div style="min-height: 100vh; background-color: #F8FAFC; color: #0F172A; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">
      <header style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
        <a href="/" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #0F172A; font-weight: 800; font-size: 1.1rem;">
          <span style="background: #2563EB; color: white; padding: 0.2rem 0.5rem; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 900;">EM</span>
          <span>ExamMaroc</span>
        </a>
        <nav style="display: flex; gap: 1rem; font-size: 0.85rem;">
          <a href="/" style="color: #475569; text-decoration: none; font-weight: 600;">الرئيسية</a>
          <a href="/universites" style="color: #475569; text-decoration: none; font-weight: 600;">الجامعات</a>
          <a href="/examens" style="color: #475569; text-decoration: none; font-weight: 600;">الامتحانات</a>
          <a href="/examens-corriges" style="color: #2563EB; text-decoration: none; font-weight: 700;">المصححة</a>
        </nav>
      </header>
      <main style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; margin-bottom: 1.5rem; color: #64748b;">
          ${cfg.breadcrumbs.map((b, i) => `
            ${i > 0 ? ' <span style="margin: 0 0.25rem;">&gt;</span> ' : ''}
            <a href="${b.url.replace(BASE_URL, '') || '/'}" style="color: #2563eb; text-decoration: none;">${escapeHtml(b.name)}</a>
          `).join('')}
        </nav>
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin-bottom: 0.75rem;">${escapeHtml(cfg.h1)}</h1>
          <p style="font-size: 1.1rem; color: #475569; line-height: 1.7;">${escapeHtml(cfg.description)}</p>
        </header>
        ${cfg.bodyHtml}
      </main>
      <footer style="margin-top: 3rem; padding: 2rem 1rem; border-top: 1px solid #e2e8f0; font-size: 0.875rem; color: #94a3b8; text-align: center; background: #FFFFFF;">
        <p>منصة ExamMaroc - الأرشيف الأكاديمي المفتوح لجميع امتحانات الجامعات المغربية الـ 12 مع التصحيح الرسمي بصيغة PDF مجاناً.</p>
        <p style="margin-top: 0.5rem;">
          <a href="/universites" style="color: #2563eb; text-decoration: none; margin: 0 0.5rem;">الجامعات المغربية</a> |
          <a href="/examens" style="color: #2563eb; text-decoration: none; margin: 0 0.5rem;">جميع الامتحانات</a> |
          <a href="/examens-corriges" style="color: #2563eb; text-decoration: none; margin: 0 0.5rem;">الامتحانات المصححة</a> |
          <a href="/etablissements" style="color: #2563eb; text-decoration: none; margin: 0 0.5rem;">الكليات والمعاهد</a>
        </p>
      </footer>
    </div>
  `;

  // On the homepage, keep root clean so React mounts with zero flash/FOUC
  if (cfg.relativePath !== '') {
    html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);
  }
  return html;
}

function writePage(relPath: string, html: string) {
  const targetDir = path.join(distDir, relPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
}

const sitemapUrls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];
const today = new Date().toISOString().split('T')[0];

function recordUrl(loc: string, priority: string = '0.8', changefreq: string = 'weekly') {
  sitemapUrls.push({
    loc,
    lastmod: today,
    changefreq,
    priority
  });
}

// -------------------------------------------------------------
// 1. HUB PAGES
// -------------------------------------------------------------
const hubs = [
  {
    path: '',
    title: 'ExamMaroc - جميع امتحانات الجامعات المغربية 2026 مع التصحيح [PDF مجاناً]',
    description: 'أكبر بنك لجميع امتحانات الجامعات المغربية الـ 12 مع عناصر الإجابة والحلول المعتمدة بصيغة PDF مجاناً. كليات القانون، الاقتصاد، الآداب، والعلوم.',
    h1: 'جميع امتحانات الجامعات المغربية في مكان واحد',
    priority: '1.0',
    changefreq: 'daily',
    body: `
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
        <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #ffffff;">
          <h2 style="font-size: 1.25rem; font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">🏛️ الجامعات المغربية الـ 12</h2>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1rem;">ابحث عن امتحانات كليات جامعة ابن زهر، محمد الخامس، الحسن الثاني، القاضي عياض وباقي الجامعات.</p>
          <a href="/universites" style="color: #2563eb; font-weight: bold; text-decoration: none;">تصفح الجامعات &larr;</a>
        </div>
        <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #ffffff;">
          <h2 style="font-size: 1.25rem; font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">📄 أكثر من 700 نموذج امتحان مع التصحيح</h2>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1rem;">تحميل مباشر بصيغة PDF لجميع السداسيات من S1 إلى S6 للدورة العادية والاستدراكية.</p>
          <a href="/examens" style="color: #2563eb; font-weight: bold; text-decoration: none;">تصفح كافة الامتحانات &larr;</a>
        </div>
        <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #ffffff;">
          <h2 style="font-size: 1.25rem; font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">✅ الامتحانات المصححة رسمياً</h2>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1rem;">نماذج مصححة بعناصر الإجابة وسلم التنقيط المعتمد للتحضير المتفوق لاجتياز الاختبارات.</p>
          <a href="/examens-corriges" style="color: #2563eb; font-weight: bold; text-decoration: none;">تصفح النماذج المصححة &larr;</a>
        </div>
      </section>

      <!-- Moroccan Student Keywords Directory Matrix -->
      <section style="margin: 2.5rem 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">🔥 بنك الكلمات والمواد الأكثر بحثاً للطلبة والتلاميذ بالمغرب</h2>
        <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem;">تصفح امتحانات أكثر من 50 مادة وشعبة الأكثر طلباً في كليات ومعاهد المملكة المغربية بصيغة PDF مع التصحيح:</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
          <div style="background: white; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-weight: 800; font-size: 1.05rem; color: #047857; margin-bottom: 0.75rem;">⚖️ القانون باللغة العربية (FSJES)</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.875rem; line-height: 2;">
              <li><a href="/examens?semester=S1&q=المدخل+لدراسة+القانون" style="color: #2563eb; text-decoration: none;">المدخل لدراسة القانون S1</a></li>
              <li><a href="/examens?semester=S1&q=المدخل+للشريعة+الإسلامية" style="color: #2563eb; text-decoration: none;">المدخل للشريعة الإسلامية S1</a></li>
              <li><a href="/examens?semester=S2&q=الالتزامات+والعقود" style="color: #2563eb; text-decoration: none;">النظرية العامة للالتزامات والعقود S2</a></li>
              <li><a href="/examens?semester=S2&q=القانون+الجنائي+العام" style="color: #2563eb; text-decoration: none;">القانون الجنائي العام S2</a></li>
              <li><a href="/examens?semester=S2&q=القانون+الدستوري" style="color: #2563eb; text-decoration: none;">القانون الدستوري والأنظمة السياسية S2</a></li>
              <li><a href="/examens?semester=S3&q=المسطرة+المدنية" style="color: #2563eb; text-decoration: none;">المسطرة المدنية والجنائية S3</a></li>
              <li><a href="/examens?semester=S3&q=المسؤولية+المدنية" style="color: #2563eb; text-decoration: none;">المسؤولية المدنية S3</a></li>
              <li><a href="/examens?semester=S4&q=قانون+الشركات" style="color: #2563eb; text-decoration: none;">قانون الشركات التجارية S4</a></li>
              <li><a href="/examens?semester=S5&q=صعوبات+المقاولة" style="color: #2563eb; text-decoration: none;">صعوبات المقاولة S5</a></li>
              <li><a href="/examens?semester=S6&q=المواريث+والتركات" style="color: #2563eb; text-decoration: none;">المواريث والتركات S6</a></li>
            </ul>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-weight: 800; font-size: 1.05rem; color: #1d4ed8; margin-bottom: 0.75rem;">📊 الاقتصاد والتدبير (Sciences Éco)</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.875rem; line-height: 2;">
              <li><a href="/examens?semester=S1&q=Microéconomie" style="color: #2563eb; text-decoration: none;">Microéconomie 1 S1</a></li>
              <li><a href="/examens?semester=S1&q=Macroéconomie" style="color: #2563eb; text-decoration: none;">Macroéconomie 1 S1</a></li>
              <li><a href="/examens?semester=S1&q=Comptabilité+Générale" style="color: #2563eb; text-decoration: none;">Comptabilité Générale S1</a></li>
              <li><a href="/examens?semester=S1&q=Management" style="color: #2563eb; text-decoration: none;">Management 1 S1</a></li>
              <li><a href="/examens?semester=S2&q=Algèbre" style="color: #2563eb; text-decoration: none;">Algèbre & Mathématiques S2</a></li>
              <li><a href="/examens?semester=S3&q=Économie+Monétaire" style="color: #2563eb; text-decoration: none;">Économie Monétaire 1 S3</a></li>
              <li><a href="/examens?semester=S3&q=Comptabilité+Analytique" style="color: #2563eb; text-decoration: none;">Comptabilité Analytique S3</a></li>
              <li><a href="/examens?semester=S3&q=Marketing" style="color: #2563eb; text-decoration: none;">Marketing Fondamental S3</a></li>
              <li><a href="/examens?semester=S4&q=Analyse+Financière" style="color: #2563eb; text-decoration: none;">Analyse Financière S4</a></li>
              <li><a href="/examens?semester=S5&q=Fiscalité" style="color: #2563eb; text-decoration: none;">Fiscalité des Entreprises S5</a></li>
            </ul>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-weight: 800; font-size: 1.05rem; color: #7e22ce; margin-bottom: 0.75rem;">🔬 العلوم والآداب (Sciences & FLSH)</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.875rem; line-height: 2;">
              <li><a href="/examens?semester=S1&q=Reading+Comprehension" style="color: #2563eb; text-decoration: none;">Reading Comprehension S1 (English)</a></li>
              <li><a href="/examens?semester=S1&q=Grammar" style="color: #2563eb; text-decoration: none;">Grammar 1 S1 (English Studies)</a></li>
              <li><a href="/examens?semester=S1&q=Analyse" style="color: #2563eb; text-decoration: none;">Analyse 1 S1 (SMIA/SMPC)</a></li>
              <li><a href="/examens?semester=S1&q=Algèbre" style="color: #2563eb; text-decoration: none;">Algèbre 1 S1</a></li>
              <li><a href="/examens?semester=S1&q=Mécanique" style="color: #2563eb; text-decoration: none;">Mécanique du Point S1</a></li>
              <li><a href="/examens?semester=S1&q=Thermodynamique" style="color: #2563eb; text-decoration: none;">Thermodynamique S1</a></li>
              <li><a href="/examens?semester=S2&q=Algorithmique" style="color: #2563eb; text-decoration: none;">Algorithmique et Langage C S2</a></li>
              <li><a href="/examens?semester=S3&q=Bases+de+Données" style="color: #2563eb; text-decoration: none;">Bases de Données (SQL) S3</a></li>
            </ul>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'universites',
    title: 'دليل الجامعات المغربية الـ 12 - نماذج امتحانات رسمية مع التصحيح | ExamMaroc',
    description: 'تصفح قائمة الجامعات المغربية الـ 12 والكليات التابعة لها: جامعة ابن زهر، محمد الخامس، الحسن الثاني، القاضي عياض، سيدي محمد بن عبد الله وغيرهم بصيغة PDF.',
    h1: 'دليل الجامعات المغربية الـ 12 ومؤسسات التعليم العالي',
    priority: '0.95',
    changefreq: 'weekly',
    body: `
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
        ${INITIAL_UNIVERSITIES.map(u => `
          <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white;">
            <h2 style="font-size: 1.15rem; font-weight: bold; color: #1e293b; margin-bottom: 0.25rem;">${escapeHtml(u.name_ar)}</h2>
            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.75rem;">${escapeHtml(u.name_fr)} — ${escapeHtml(u.city_ar)}</p>
            <a href="/universites/${u.slug}" style="color: #2563eb; font-weight: 600; font-size: 0.9rem; text-decoration: none;">تصفح كليات وامتحانات الجامعة &larr;</a>
          </div>
        `).join('')}
      </section>
    `
  },
  {
    path: 'examens',
    title: 'مستودع امتحانات الجامعات المغربية مع التصحيح PDF | ExamMaroc',
    description: 'أرشيف امتحانات كليات الحقوق والاقتصاد والآداب والعلوم بالمغرب لجميع الفصول S1, S2, S3, S4, S5, S6 بصيغة PDF برابط مباشر مجاناً.',
    h1: 'مستودع نماذج امتحانات الجامعات المغربية الرسمية',
    priority: '0.95',
    changefreq: 'daily',
    body: `
      <p style="margin: 1.5rem 0; font-size: 1rem; color: #475569;">تصفح آلاف الامتحانات الرسمية المصنفة حسب الجامعة والكلية والشعبة والدورة والسنة مع إمكانية التحميل المباشر بصيغة PDF.</p>
    `
  },
  {
    path: 'examens-corriges',
    title: 'امتحانات جامعية مصححة مع سلم التنقيط PDF | ExamMaroc',
    description: 'نماذج امتحانات جامعية مصححة مع عناصر الإجابة وسلم التنقيط المعتمد لطلبة القانون والاقتصاد والتدبير والآداب والعلوم مجاناً بصيغة PDF.',
    h1: 'نماذج الامتحانات الجامعية المصححة رسمياً مع عناصر الإجابة',
    priority: '0.95',
    changefreq: 'daily',
    body: `
      <p style="margin: 1.5rem 0; font-size: 1rem; color: #475569;">مجموعة مختارة من أفضل نماذج الامتحانات المرفقة بعناصر الإجابة النموذجية وسلم التنقيط المعتمد من الأساتذة المحاضرين لضمان أعلى المراتب في الامتحانات الجامعية.</p>
    `
  },
  {
    path: 'etablissements',
    title: 'دليل الكليات والمدارس العليا والمعاهد بالمغرب | ExamMaroc',
    description: 'دليل مؤسسات التعليم العالي بالمغرب: كليات العلوم القانونية والاقتصادية (FSJES)، كليات الآداب (FLSH)، كليات العلوم (FS)، المدارس العليا (ENCG, ENSA, EST).',
    h1: 'دليل كليات ومعاهد ومدارس التعليم العالي بالمغرب',
    priority: '0.9',
    changefreq: 'weekly',
    body: `
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
        ${INITIAL_FACULTIES.slice(0, 30).map(f => {
          const uni = uniMap.get(f.university_id);
          return `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white;">
              <h2 style="font-size: 1.1rem; font-weight: bold; color: #1e293b;">${escapeHtml(f.name_ar)}</h2>
              <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">${escapeHtml(uni?.name_ar || '')} — ${escapeHtml(f.city || '')}</p>
              <p style="font-size: 0.85rem; color: #475569; margin-top: 0.5rem;">${escapeHtml(f.description || '')}</p>
            </div>
          `;
        }).join('')}
      </section>
    `
  },
  {
    path: 'facultes',
    title: 'كليات المغرب - دليل الشُعب والمسالك ونماذج الامتحانات | ExamMaroc',
    description: 'كليات المغرب: كليات الحقوق والاقتصاد والعلوم الإنسانية والعلوم الدقيقة مع نماذج الامتحانات الرسمية والتصحيح بصيغة PDF.',
    h1: 'كليات ومعاهد المملكة المغربية - الامتحانات والمسالك',
    priority: '0.9',
    changefreq: 'weekly',
    body: `<p style="margin: 1.5rem 0;">استكشف جميع كليات المغرب وحمّل النماذج المعتمدة لجميع الفصول.</p>`
  },
  {
    path: 'latest-exams',
    title: 'أحدث نماذج الامتحانات الجامعية المضافة 2026 | ExamMaroc',
    description: 'تابع آخر نماذج الامتحانات الجامعية المضافة حديثاً لموسم 2025/2026 مع التصحيح للدورة العادية والاستدراكية بصيغة PDF.',
    h1: 'أحدث نماذج الامتحانات الجامعية 2026',
    priority: '0.9',
    changefreq: 'daily',
    body: `<p style="margin: 1.5rem 0;">يتم تحديث هذه الصفحة يومياً بنماذج الامتحانات الأحدث المضافة من مختلف كليات المغرب.</p>`
  },
  {
    path: 'subjects',
    title: 'دليل مواد ووحدات التعليم الجامعي بالمغرب | ExamMaroc',
    description: 'فهرس شامل لجميع مواد ووحدات كليات القانون، الاقتصاد والتدبير، الآداب، والعلوم لجميع الفصول S1-S6 مع امتحانات كل مادة.',
    h1: 'دليل مواد ووحدات التعليم العالي بالمغرب',
    priority: '0.9',
    changefreq: 'weekly',
    body: `
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-top: 2rem;">
        ${INITIAL_SUBJECTS.map(s => `
          <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white;">
            <h2 style="font-size: 1rem; font-weight: bold; color: #1e293b;">${escapeHtml(s.name_ar)}</h2>
            <p style="font-size: 0.85rem; color: #64748b;">${escapeHtml(s.name_fr)} — ${escapeHtml(s.semester || '')}</p>
          </div>
        `).join('')}
      </section>
    `
  },
  {
    path: 'examens-master-maroc',
    title: 'نماذج امتحانات ولوج الماستر بالجامعات المغربية مع التصحيح PDF | ExamMaroc',
    description: 'تحميل نماذج امتحانات مباريات ولوج الماستر بالجامعات المغربية (FSJES، FLSH، FS) بصيغة PDF مجاناً مع التصحيحات النموذجية ومنهجية اجتياز الاختبارات الكتابية والشفوية.',
    h1: 'نماذج امتحانات ولوج الماستر بالجامعات المغربية مع عناصر الإجابة',
    priority: '0.98',
    changefreq: 'daily',
    body: `
      <section style="margin: 2rem 0;">
        <h2 style="font-size: 1.35rem; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">🎓 مستودع مباريات الماستر والماستر المتخصص بالمغرب</h2>
        <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem;">تجميعة شاملة لمواضيع الاختبارات الكتابية لمباريات سلك الماستر بكليات العلوم القانونية والاقتصادية والآداب والعلوم مع عناصر الإجابة وشبكات التنقيط المعتمدة.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: bold; color: #1e293b;">⚖️ ماستر القانون الخاص والعام</h3>
            <p style="color: #64748b; font-size: 0.875rem; margin: 0.5rem 0;">قانون الأعمال، القانون المدني والمعاملات الإلكترونية، العلوم الجنائية، المنازعات العمومية.</p>
            <a href="/examens?semester=Master&q=قانون" style="color: #2563eb; font-weight: 600; font-size: 0.875rem; text-decoration: none;">تحميل نماذج ماستر القانون &larr;</a>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: bold; color: #1e293b;">📊 ماستر الاقتصاد والتدبير والمالية</h3>
            <p style="color: #64748b; font-size: 0.875rem; margin: 0.5rem 0;">المالية والبنك، التدقيق ومراقبة التسيير، اللوجستيك وسلاسل الإمداد، التسويق الرقمي.</p>
            <a href="/examens?semester=Master&q=Finance" style="color: #2563eb; font-weight: 600; font-size: 0.875rem; text-decoration: none;">تحميل نماذج ماستر الاقتصاد &larr;</a>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: bold; color: #1e293b;">🔬 ماستر العلوم الدقيقة والتطبيقية</h3>
            <p style="color: #64748b; font-size: 0.875rem; margin: 0.5rem 0;">الذكاء الاصطناعي وعلوم البيانات، أمن الأنظمة المعلوماتية، الرياضيات التطبيقية.</p>
            <a href="/examens?semester=Master&q=Informatique" style="color: #2563eb; font-weight: 600; font-size: 0.875rem; text-decoration: none;">تحميل نماذج ماستر العلوم &larr;</a>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'examens/droit-arabe',
    title: 'امتحانات شعبة القانون باللغة العربية S1-S6 مع التصحيح PDF | ExamMaroc',
    description: 'أرشيف شامل لجميع نماذج امتحانات شعبة القانون باللغة العربية بجميع كليات الحقوق المغربية (FSJES) من الفصل الأول S1 إلى الفصل السادس S6 بصيغة PDF مع عناصر الإجابة والتصحيحات الرسمية مجاناً.',
    h1: 'امتحانات شعبة القانون باللغة العربية S1-S6 مع عناصر الإجابة الرسمية',
    priority: '0.98',
    changefreq: 'daily',
    body: `
      <section style="margin: 2rem 0;">
        <p style="font-size: 1.05rem; color: #475569; line-height: 1.7; margin-bottom: 1.5rem;">أكبر قاعدة بيانات مغربية لنماذج امتحانات كلية العلوم القانونية والاقتصادية والاجتماعية لجميع فصول الإجازة في القانون باللغة العربية مع التصحيح الرسمي وسلم التنقيط.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-weight: bold; color: #1e293b;">الفصل الأول S1</h3>
            <p style="font-size: 0.875rem; color: #64748b;">المدخل لدراسة القانون، الشريعة الإسلامية، العلوم السياسية، العلاقات الدولية.</p>
            <a href="/examens?semester=S1&q=قانون" style="color: #2563eb; font-weight: bold; text-decoration: none; font-size: 0.875rem;">نماذج الفصل S1 &larr;</a>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-weight: bold; color: #1e293b;">الفصل الثاني S2</h3>
            <p style="font-size: 0.875rem; color: #64748b;">النظرية العامة للالتزامات والعقود، القانون الجنائي العام، القانون الدستوري.</p>
            <a href="/examens?semester=S2&q=قانون" style="color: #2563eb; font-weight: bold; text-decoration: none; font-size: 0.875rem;">نماذج الفصل S2 &larr;</a>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-weight: bold; color: #1e293b;">الفصل الثالث والرابع S3-S4</h3>
            <p style="font-size: 0.875rem; color: #64748b;">المسؤولية المدنية، قانون الميزانية، قانون الشركات، التنظيم القضائي.</p>
            <a href="/examens?semester=S3&q=قانون" style="color: #2563eb; font-weight: bold; text-decoration: none; font-size: 0.875rem;">نماذج الفصول S3-S4 &larr;</a>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-weight: bold; color: #1e293b;">الفصل الخامس والسادس S5-S6</h3>
            <p style="font-size: 0.875rem; color: #64748b;">العقود الخاصة، صعوبات المقاولة، المسطرة المدنية والجنائية، القانون العقاري.</p>
            <a href="/examens?semester=S5&q=قانون" style="color: #2563eb; font-weight: bold; text-decoration: none; font-size: 0.875rem;">نماذج الفصول S5-S6 &larr;</a>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'examens/economie-gestion',
    title: 'امتحانات شعبة الاقتصاد والتدبير S1-S6 مع التصحيح PDF | ExamMaroc',
    description: 'تحميل جميع نماذج امتحانات شعبة الاقتصاد والتدبير (Économie & Gestion) من الفصل S1 إلى S6 لجميع الكليات والمدارس المغربية بصيغة PDF مع حلول التمارين وعناصر الإجابة الرسمية.',
    h1: 'امتحانات شعبة الاقتصاد والتدبير (Économie & Gestion) مع التصحيح PDF',
    priority: '0.98',
    changefreq: 'daily',
    body: `
      <section style="margin: 2rem 0;">
        <p style="font-size: 1.05rem; color: #475569; line-height: 1.7; margin-bottom: 1.5rem;">نماذج امتحانات المحاسبة العامة، الاقتصاد الجزئي والكلي، التحليل المالي، والإحصاء لطلبة كليات FSJES ومدارس ENCG بصيغة PDF مع التصحيح الرياضي المفصل.</p>
      </section>
    `
  },
  {
    path: 'examens/sciences-technologies',
    title: 'امتحانات كليات العلوم والتقنيات SMIA SMP SMC مع الحلول PDF | ExamMaroc',
    description: 'أرشيف امتحانات كليات العلوم المغربية (FS & FST) لمسالك الرياضيات والإعلاميات SMIA والفيزياء SMP والكيمياء SMC من S1 إلى S6 بصيغة PDF مع عناصر الإجابة والحلول البرمجية والفيزيائية.',
    h1: 'امتحانات كليات العلوم والتقنيات (SMIA, SMP, SMC) مع التصحيح PDF',
    priority: '0.98',
    changefreq: 'daily',
    body: `
      <section style="margin: 2rem 0;">
        <p style="font-size: 1.05rem; color: #475569; line-height: 1.7; margin-bottom: 1.5rem;">تحميل امتحانات الرياضيات، الإعلاميات والفيزياء: Analyse 1-4, Algèbre 1-3, Langage C, Électrostatique, Mécanique du Point لجميع الفصول بصيغة PDF.</p>
      </section>
    `
  },
  {
    path: 'examens/etudes-anglaises',
    title: 'English Studies Semester Exams FLSH Morocco PDF with Keys | ExamMaroc',
    description: 'Download Moroccan University English Studies exams (S1, S2, S3, S4, S5, S6) with answer keys in PDF format. FLSH Ibn Zohr, Mohammed V, Hassan II, Cadi Ayyad.',
    h1: 'English Studies Semester Exams FLSH Morocco PDF with Keys',
    priority: '0.98',
    changefreq: 'daily',
    body: `
      <section style="margin: 2rem 0;">
        <p style="font-size: 1.05rem; color: #475569; line-height: 1.7; margin-bottom: 1.5rem;">Full collection of FLSH English department examination papers: Reading & Writing, Grammar, Linguistics, and Literature with keys for S1, S2, S3, S4, S5, S6.</p>
      </section>
    `
  },
  {
    path: 'guide-convocation-examens',
    title: 'دليل استدعاء الامتحانات وجداول المراقبة بالجامعات المغربية 2024-2026 | ExamMaroc',
    description: 'الدليل الإرشادي الشامل للطلبة المغاربة: كيفية استخراج استدعاء الامتحانات الجامعية (Convocation)، الوثائق المطلوبة، ضوابط النزاهة داخل المدرجات، ونظام استيفاء الفصول والمجزوءات.',
    h1: 'دليل استدعاء الامتحانات الجامعية وجداول المراقبة المستمرة',
    priority: '0.95',
    changefreq: 'weekly',
    body: `
      <section style="margin: 2rem 0;">
        <p style="font-size: 1.05rem; color: #475569; line-height: 1.7; margin-bottom: 1.5rem;">شرح عملي مفصل للطلبة المغاربة حول طرق استخراج استدعاءات الامتحانات من الفضاء الرقمي للطالب (ENT/Apogée)، الوثائق الرسمية المطلوبة، والضوابط التنظيمية للدورة العادية والاستدراكية.</p>
      </section>
    `
  }
];

for (const hub of hubs) {
  const url = hub.path ? `${BASE_URL}/${hub.path}` : `${BASE_URL}/`;
  const breadcrumbs = [
    { name: 'الرئيسية', url: `${BASE_URL}/` }
  ];
  if (hub.path) {
    breadcrumbs.push({ name: hub.h1, url });
  }

  const html = generateHtml({
    relativePath: hub.path,
    url,
    title: hub.title,
    description: hub.description,
    h1: hub.h1,
    breadcrumbs,
    schemas: [],
    bodyHtml: hub.body
  });

  writePage(hub.path, html);
  recordUrl(url, hub.priority, hub.changefreq);
}

// -------------------------------------------------------------
// 2. UNIVERSITIES (All 12)
// -------------------------------------------------------------
for (const uni of INITIAL_UNIVERSITIES) {
  const url = `${BASE_URL}/universites/${uni.slug}`;
  const faculties = INITIAL_FACULTIES.filter(f => f.university_id === uni.id);
  const uniExams = INITIAL_EXAMS.filter(e => e.university_id === uni.id);

  const title = `امتحانات ${uni.name_ar} 2026 مع التصحيح PDF | ExamMaroc`;
  const description = `نماذج امتحانات كليات ${uni.name_ar} (${uni.name_fr} - ${uni.city_ar}) لجميع الفصول S1, S2, S3, S4, S5, S6 بصيغة PDF مع التصحيح وسلم التنقيط وتواريخ الامتحانات 2026.`;
  const h1 = `امتحانات ${uni.name_ar} 2026 (${uni.name_fr}) - النماذج الرسمية والتصحيح`;

  const faqs = [
    {
      q: `كيف يمكنني سحب استدعاء امتحانات ${uni.name_ar} 2026؟`,
      a: `يتم سحب استدعاء الامتحانات عبر المنصة الرقمية للشؤون الطلابية للكلية المعنية التابعة لـ ${uni.name_ar} بإدخال الرقم الوطني للطالب (مسار/CNE) ورقم التسجيل الأبوجي (Apogée) وطباعته في ورقة A4 واضحة.`
    },
    {
      q: `ما هي الوثائق المطلوبة لاجتياز امتحانات ${uni.name_ar}؟`,
      a: `يشترط إحضار: 1) الاستدعاء المطبوع للامتحان، 2) بطاقة الطالب أو شهادة التسجيل للموسم الحالي، 3) البطاقة الوطنية للتعريف الإلكترونية (CNIE).`
    },
    {
      q: `أين أجد نماذج امتحانات كليات ${uni.name_ar} مع التصحيح؟`,
      a: `يوفر موقع ExamMaroc مكتبة كاملة لجميع امتحانات كليات ${uni.name_ar} (${faculties.map(f => f.name_ar).slice(0, 3).join('، ')}) بصيغة PDF مجاناً مع عناصر الإجابة المعتمدة.`
    }
  ];

  const bodyHtml = `
    <div style="background: #fffbeb; border: 1px solid #fef3c7; border-right: 4px solid #f59e0b; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 2rem;">
      <h2 style="font-weight: 700; color: #92400e; font-size: 1.1rem; margin-bottom: 0.5rem;">📅 مواعيد وتواريخ الامتحانات الرسمية 2026 (${escapeHtml(uni.name_ar)})</h2>
      <ul style="list-style: disc; margin-right: 1.5rem; color: #78350f; font-size: 0.95rem; line-height: 1.8;">
        <li>توقف الدراسة للدورة الربيعية: <strong>السبت 16 ماي 2026</strong></li>
        <li>انطلاق امتحانات الدورة الربيعية العادية: <strong>الإثنين 01 يونيو 2026</strong></li>
        <li>امتحانات الدورة الخريفية: <strong>يناير 2026</strong></li>
      </ul>
    </div>

    <section style="margin-top: 2rem;">
      <h2 style="font-size: 1.4rem; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">الكليات والمؤسسات التابعة لـ ${escapeHtml(uni.name_ar)} (${faculties.length} مؤسسة)</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${faculties.map(f => `
          <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #ffffff;">
            <h3 style="font-weight: 700; font-size: 1.1rem; color: #1e293b; margin-bottom: 0.5rem;">${escapeHtml(f.name_ar)}</h3>
            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">${escapeHtml(f.name_fr)} — ${escapeHtml(f.city || uni.city_ar)}</p>
            <p style="font-size: 0.85rem; color: #475569;">${escapeHtml(f.description || '')}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section style="margin-top: 2.5rem;">
      <h2 style="font-size: 1.4rem; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">نماذج الامتحانات المتوفرة لـ ${escapeHtml(uni.name_ar)} (${uniExams.length} امتحان)</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
        ${uniExams.slice(0, 18).map(e => `
          <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; font-weight: bold; padding: 0.2rem 0.5rem; background: #eff6ff; color: #2563eb; border-radius: 0.25rem;">${escapeHtml(e.semester)}</span>
              <span style="font-size: 0.75rem; color: #64748b;">${e.year} (${e.session === 'normale' ? 'دورة عادية' : 'استدراك'})</span>
            </div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">
              <a href="/examens/${e.slug}" style="color: #1e293b; text-decoration: none;">${escapeHtml(e.title)}</a>
            </h3>
            <a href="/examens/${e.slug}" style="display: inline-block; font-size: 0.85rem; color: #2563eb; font-weight: 600; text-decoration: none;">تحميل الامتحان والتصحيح PDF &larr;</a>
          </div>
        `).join('')}
      </div>
    </section>

    <section style="margin-top: 2.5rem; background: #f8fafc; padding: 1.5rem; border-radius: 0.75rem;">
      <h2 style="font-size: 1.4rem; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">الأسئلة الشائعة حول امتحانات ${escapeHtml(uni.name_ar)}</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${faqs.map(f => `
          <div style="background: white; padding: 1rem 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${escapeHtml(f.q)}</h3>
            <p style="font-size: 0.925rem; color: #475569; line-height: 1.6;">${escapeHtml(f.a)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': uni.name_ar,
      'alternateName': uni.name_fr,
      'url': url,
      'description': description
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    }
  ];

  const breadcrumbs = [
    { name: 'الرئيسية', url: `${BASE_URL}/` },
    { name: 'الجامعات المغربية', url: `${BASE_URL}/universites` },
    { name: uni.name_ar, url }
  ];

  const html = generateHtml({
    relativePath: `universites/${uni.slug}`,
    url,
    title,
    description,
    h1,
    breadcrumbs,
    schemas,
    bodyHtml
  });

  writePage(`universites/${uni.slug}`, html);
  recordUrl(url, '0.95', 'daily');

  // Dedicated special landing routes for Ibn Zohr
  if (uni.slug === 'ibn-zohr') {
    writePage('examens-ibn-zohr', html);
    writePage('guide-examens-ibn-zohr', html);
    recordUrl(`${BASE_URL}/examens-ibn-zohr`, '0.95', 'daily');
    recordUrl(`${BASE_URL}/guide-examens-ibn-zohr`, '0.9', 'weekly');
  }
}

// -------------------------------------------------------------
// 3. ALL 722 EXAMS (Pre-rendered for Instant Google Indexing!)
// -------------------------------------------------------------
console.log(`Starting pre-rendering for all ${INITIAL_EXAMS.length} exams...`);

for (const exam of INITIAL_EXAMS) {
  const uni = uniMap.get(exam.university_id);
  const fac = facMap.get(exam.faculty_id || '');
  const prog = progMap.get(exam.program_id || '');
  const sub = subMap.get(exam.subject_id || '');

  const sessionName = exam.session === 'normale' ? 'دورة عادية' : 'دورة استدراكية';
  const url = `${BASE_URL}/examens/${exam.slug}`;

  const title = `امتحان ${exam.title} (${sessionName}) ${exam.year} PDF مع التصحيح | ExamMaroc`;
  const description = `تحميل نموذج امتحان ${exam.title} (${sessionName}) لسنة ${exam.year} بصيغة PDF مجاناً. ${
    exam.has_correction
      ? 'يتضمن عناصر الإجابة الرسمية وسلّم التنقيط المعتمد للمراجعة والتحضير للدورة العادية والاستدراكية.'
      : 'نسخة واضحة قابلة للتحميل والطباعة للمراجعة والتحضير لاجتياز اختبارات الكلية.'
  } مخصص لطلبة ${uni ? uni.name_ar : 'الجامعات المغربية'}${fac ? ` بكلية ${fac.name_ar}` : ''}.`;

  const h1 = `امتحان ${exam.title} - ${sessionName} ${exam.year}`;

  const breadcrumbs = [
    { name: 'الرئيسية', url: `${BASE_URL}/` },
    { name: 'الامتحانات', url: `${BASE_URL}/examens` }
  ];
  if (uni) {
    breadcrumbs.push({ name: uni.name_ar, url: `${BASE_URL}/universites/${uni.slug}` });
  }
  breadcrumbs.push({ name: exam.title, url });

  const faqs = [
    {
      q: `كيف يمكنني تحميل امتحان ${exam.title} بصيغة PDF؟`,
      a: `يمكنك تحميل هذا النموذج مباشرة بصيغة PDF مجاناً عبر الرابط المباشر في المنصة دون الحاجة لإنشاء حساب أو انتظار.`
    },
    {
      q: `هل يتوفر هذا الامتحان على عناصر الإجابة والتصحيح؟`,
      a: exam.has_correction
        ? `نعم، يتضمن هذا النموذج التصحيح المعتمد وسلم التنقيط لمساعدتك في فهم صياغة الأجوبة النموذجية.`
        : `هذا الملف يتضمن نص أسئلة الامتحان الأصلي، وتتوفر نماذج مصححة أخرى لنفس المادة في قسم الامتحانات المصححة.`
    },
    {
      q: `ما هي الشعبة والكلية الخاصة بهذا الامتحان؟`,
      a: `هذا الامتحان موجه لطلبة ${uni ? uni.name_ar : 'الجامعة'}${fac ? ` بكلية ${fac.name_ar}` : ''}${prog ? `، شعبة ${prog.name_ar}` : ''} للفصل الدراسي ${exam.semester}.`
    }
  ];

  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      '@id': `${url}#learning-resource`,
      'name': exam.title,
      'description': description,
      'educationalLevel': 'Higher Education / الجامعة المغربية',
      'learningResourceType': 'Exam Paper',
      'encodingFormat': 'application/pdf',
      'isAccessibleForFree': true,
      'datePublished': `${exam.year}-01-15`,
      'url': url,
      'provider': uni ? {
        '@type': 'EducationalOrganization',
        'name': uni.name_ar,
        'url': `${BASE_URL}/universites/${uni.slug}`
      } : undefined,
      'about': sub ? {
        '@type': 'Course',
        'name': sub.name_ar,
        'courseCode': sub.slug
      } : undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    }
  ];

  const bodyHtml = `
    <article style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
        <span style="background: #eff6ff; color: #2563eb; font-weight: bold; font-size: 0.85rem; padding: 0.35rem 0.75rem; border-radius: 0.375rem;">${escapeHtml(exam.semester)}</span>
        <span style="background: #f1f5f9; color: #475569; font-size: 0.85rem; padding: 0.35rem 0.75rem; border-radius: 0.375rem;">${escapeHtml(sessionName)}</span>
        <span style="background: #f1f5f9; color: #475569; font-size: 0.85rem; padding: 0.35rem 0.75rem; border-radius: 0.375rem;">سنة ${exam.year}</span>
        ${exam.has_correction ? '<span style="background: #ecfdf5; color: #059669; font-weight: bold; font-size: 0.85rem; padding: 0.35rem 0.75rem; border-radius: 0.375rem;">✅ يتوفر على التصحيح</span>' : ''}
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; background: #f8fafc; padding: 1.25rem; border-radius: 0.5rem;">
        <div>
          <span style="font-size: 0.8rem; color: #64748b; display: block;">الجامعة</span>
          <strong style="color: #0f172a;">${escapeHtml(uni?.name_ar || 'جامعة مغربية')}</strong>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: #64748b; display: block;">الكلية / المؤسسة</span>
          <strong style="color: #0f172a;">${escapeHtml(fac?.name_ar || 'الكلية المعنية')}</strong>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: #64748b; display: block;">الشعبة / المسلك</span>
          <strong style="color: #0f172a;">${escapeHtml(prog?.name_ar || 'الإجازة الأساسية')}</strong>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: #64748b; display: block;">المادة / الوحدة</span>
          <strong style="color: #0f172a;">${escapeHtml(sub?.name_ar || exam.title)}</strong>
        </div>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.75rem; padding: 1.5rem; text-align: center; margin: 2rem 0;">
        <h2 style="font-size: 1.25rem; font-weight: bold; color: #166534; margin-bottom: 0.5rem;">تحميل نموذج الامتحان بصيغة PDF مجاناً</h2>
        <p style="color: #15803d; font-size: 0.95rem; margin-bottom: 1.25rem;">ملف واضح وجاهز للمراجعة والطباعة برابط مباشر آمن</p>
        <a href="${exam.source_url || '#'}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #16a34a; color: white; font-weight: bold; padding: 0.85rem 2rem; border-radius: 0.5rem; text-decoration: none; font-size: 1.05rem;">
          📥 تحميل الامتحان PDF الآن
        </a>
      </div>

      <section style="margin-top: 2.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">أسئلة متكررة وإرشادات لاجتياز هذا الامتحان</h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${faqs.map(f => `
            <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem;">
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem;">${escapeHtml(f.q)}</h3>
              <p style="font-size: 0.9rem; color: #475569; margin: 0;">${escapeHtml(f.a)}</p>
            </div>
          `).join('')}
        </div>
      </section>
    </article>
  `;

  const html = generateHtml({
    relativePath: `examens/${exam.slug}`,
    url,
    title,
    description,
    h1,
    breadcrumbs,
    schemas,
    bodyHtml
  });

  writePage(`examens/${exam.slug}`, html);
  recordUrl(url, '0.85', 'monthly');
}

console.log(`Pre-rendered ${INITIAL_EXAMS.length} exams successfully!`);

// -------------------------------------------------------------
// 4. WRITE UPDATED SITEMAP.XML
// -------------------------------------------------------------
console.log(`Generating sitemap with ${sitemapUrls.length} URLs...`);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write to both public and dist
fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`Sitemap written successfully to public/sitemap.xml and dist/sitemap.xml! (${sitemapUrls.length} URLs)`);
