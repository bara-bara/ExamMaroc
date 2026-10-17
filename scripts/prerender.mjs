import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist! Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

const universitiesData = [
  {
    slug: 'ibn-zohr',
    name_ar: 'جامعة ابن زهر',
    city_ar: 'أكادير والجهات الجنوبية',
    title: 'امتحانات جامعة ابن زهر أكادير 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كلية القانون والاقتصاد والآداب والعلوم جامعة ابن زهر أكادير (UIZ) لجميع الفصول S1, S2, S3, S4, S5, S6 بصيغة PDF مع التصحيح وسلم التنقيط وتواريخ الامتحانات 2026.',
    keywords: 'امتحانات جامعة ابن زهر, نماذج امتحانات كلية القانون ابن زهر أكادير, FSJES Agadir examens, امتحانات كلية الاداب ابن زهر, استدعاء امتحانات جامعة ابن زهر, موعد امتحانات جامعة ابن زهر 2026',
    h1: 'امتحانات جامعة ابن زهر أكادير 2026 (UIZ) - النماذج الرسمية والتصحيح',
    lead: 'المستودع الأكاديمي الشامل لجميع نماذج امتحانات كليات جامعة ابن زهر بأكادير وأيت ملول وكلميم والعيون وورززات وتارودانت لجميع المسالك والفصول مع التصحيح النموذجي وسلم التنقيط بصيغة PDF مجاناً.',
    faculties: [
      { name: 'كلية العلوم القانونية والاقتصادية والاجتماعية - أكادير (FSJES)', desc: 'امتحانات القانون باللغتين العربية والفرنسية، مسالك الاقتصاد والتدبير لجميع السداسيات S1 إلى S6' },
      { name: 'القطب الجامعي أيت ملول (CUAM / FSJESAM)', desc: 'نماذج امتحانات كليات أيت ملول المعتمدة مع تواريخ الإجراء واستدعاءات الامتحانات' },
      { name: 'كلية الآداب والعلوم الإنسانية - أكادير (FLSH)', desc: 'امتحانات الدراسات الإنجليزية، الفرنسية، العربية، التاريخ والحضارة، الجغرافيا، وعلم الاجتماع' },
      { name: 'كلية العلوم - أكادير (FSA)', desc: 'امتحانات الرياضيات، الفيزياء، الكيمياء، وعلوم الحياة والأرض مع عناصر الإجابة والتمارين المحلولة' },
      { name: 'المدرسة الوطنية للتجارة والتسيير - أكادير (ENCG)', desc: 'نماذج اختبارات التسيير والمحاسبة والتسويق واختبارات الماستر والإجازة المهنية' },
      { name: 'المدرسة الوطنية للعلوم التطبيقية - أكادير (ENSA)', desc: 'امتحانات الهندسة المعلوماتية، الصناعية، والمدنية مع التصحيح المفصل' }
    ],
    dates: {
      springStop: 'السبت 16 ماي 2026',
      springStart: 'الإثنين 01 يونيو 2026',
      autumnStart: 'يناير 2026'
    },
    faqs: [
      {
        q: 'كيف يمكنني الحصول على استدعاء امتحانات جامعة ابن زهر 2026؟',
        a: 'يتم سحب استدعاء الامتحانات عبر المنصة الإلكترونية للشؤون الطلابية للكلية المعنية (مثل منظومة FSJESAM أو موقع UIZ) عن طريق إدخال الرقم الوطني للطالب (CNE/مسار) ورقم التسجيل الأبوجي (Apogée)، ثم طباعة الاستدعاء على ورقة A4 واضحة.'
      },
      {
        q: 'ما هي الوثائق الإلزامية لاجتياز الامتحانات في جامعة ابن زهر؟',
        a: 'يشترط اصطحاب ثلاث وثائق رسمية: 1) استدعاء الامتحان المطبوع من المنصة، 2) بطاقة الطالب الجامعية أو شهادة التسجيل للموسم الحالي، 3) البطاقة الوطنية للتعريف الإلكترونية (CNIE).'
      },
      {
        q: 'متى تنطلق امتحانات الدورة الربيعية العادية بجامعة ابن زهر؟',
        a: 'وفقاً للإعلانات الرسمية للجامعة، تتوقف الدراسة يوم السبت 16 ماي 2026، وتنطلق امتحانات الدورة الربيعية العادية ابتداءً من يوم الإثنين 01 يونيو 2026.'
      },
      {
        q: 'أين أجد نماذج امتحانات كلية الحقوق والاقتصاد ابن زهر مع التصحيح؟',
        a: 'يوفر موقع ExamMaroc مكتبة رقمية كاملة لجميع امتحانات FSJES أكادير وأيت ملول مصنفة حسب الفصول (S1, S2, S3, S4, S5, S6) ومرفقة بحلول نموذجية وسلم تنقيط معتمد للتحميل بصيغة PDF مباشرة.'
      }
    ]
  },
  {
    slug: 'mohammed-v',
    name_ar: 'جامعة محمد الخامس',
    city_ar: 'الرباط',
    title: 'امتحانات جامعة محمد الخامس بالرباط 2026 مع التصحيح PDF | ExamMaroc',
    description: 'تحميل نماذج امتحانات كليات جامعة محمد الخامس بالرباط السويسي وأكدال لجميع المسالك والفصول S1-S6 مع عناصر الإجابة والتصحيح النموذجي PDF.',
    keywords: 'امتحانات جامعة محمد الخامس, امتحانات كلية الحقوق اكدال, امتحانات FSJES السويسي, امتحانات كلية العلوم الرباط',
    h1: 'امتحانات جامعة محمد الخامس بالرباط 2026 - النماذج والتصحيح',
    lead: 'نماذج امتحانات كليات أكدال والسويسي لجامعة محمد الخامس بالرباط لجميع التخصصات والفصول بصيغة PDF مجاناً.',
    faculties: [
      { name: 'كلية العلوم القانونية والاقتصادية والاجتماعية - أكدال', desc: 'امتحانات القانون العام والخاص والاقتصاد' },
      { name: 'كلية العلوم القانونية والاقتصادية والاجتماعية - السويسي', desc: 'نماذج امتحانات الاقتصاد والتدبير والعلوم السياسية' },
      { name: 'كلية الآداب والعلوم الإنسانية - الرباط', desc: 'امتحانات اللغات والعلوم الإنسانية والاجتماعية' },
      { name: 'كلية العلوم بالرباط', desc: 'امتحانات مسالك العلوم الرياضية والفيزيائية والحياتية' }
    ],
    faqs: [
      {
        q: 'كيف أحصل على امتحانات كلية الحقوق أكدال الرباط؟',
        a: 'يمكنك تصفح وتحميل جميع نماذج امتحانات كلية العلوم القانونية والاقتصادية أكدال لجميع الفصول السداسية مباشرة عبر منصة ExamMaroc مجاناً.'
      }
    ]
  },
  {
    slug: 'hassan-2',
    name_ar: 'جامعة الحسن الثاني',
    city_ar: 'الدار البيضاء والمحمدية',
    title: 'امتحانات جامعة الحسن الثاني بالدار البيضاء 2026 PDF مع التصحيح | ExamMaroc',
    description: 'امتحانات كليات جامعة الحسن الثاني الدار البيضاء (عين الشق، طريق الجديدة، المحمدية) بصيغة PDF مع عناصر الإجابة والتصحيح.',
    keywords: 'امتحانات جامعة الحسن الثاني, امتحانات كلية الحقوق عين الشق, امتحانات FSJES طريق الجديدة, امتحانات المحمدية',
    h1: 'امتحانات جامعة الحسن الثاني بالدار البيضاء 2026 - النماذج والتصحيح',
    lead: 'نماذج امتحانات كليات جامعة الحسن الثاني بالدار البيضاء والمحمدية لجميع التخصصات والفصول بصيغة PDF مجاناً.',
    faculties: [
      { name: 'كلية الحقوق والاقتصاد - عين الشق', desc: 'امتحانات القانون والاقتصاد والتسيير' },
      { name: 'كلية الحقوق والاقتصاد - طريق الجديدة', desc: 'نماذج امتحانات السداسيات من S1 إلى S6' },
      { name: 'كلية الحقوق والاقتصاد - المحمدية', desc: 'امتحانات الإجازة والماستر مع التصحيح' }
    ],
    faqs: [
      {
        q: 'كيف أحمل امتحانات كلية الحقوق عين الشق بالدار البيضاء؟',
        a: 'موقع ExamMaroc يتيح تنزيل أرشيف شامل لامتحانات كلية عين الشق وطريق الجديدة بصيغة PDF مجاناً.'
      }
    ]
  },
  {
    slug: 'cadi-ayyad',
    name_ar: 'جامعة القاضي عياض',
    city_ar: 'مراكش',
    title: 'امتحانات جامعة القاضي عياض بمراكش 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات جامعة القاضي عياض بمراكش وقلعة السراغنة والصويرة وآسفي مع التصحيح النموذجي وسلم التنقيط PDF.',
    keywords: 'امتحانات جامعة القاضي عياض, امتحانات كلية الحقوق مراكش, امتحانات FSJES مراكش, امتحانات كلية العلوم السملالية',
    h1: 'امتحانات جامعة القاضي عياض بمراكش 2026 - النماذج والتصحيح',
    lead: 'أرشيف امتحانات جامعة القاضي عياض لجميع المسالك والفصول مع عناصر الإجابة والحلول المعتمدة.',
    faculties: [
      { name: 'كلية العلوم القانونية والاقتصادية - مراكش', desc: 'امتحانات القانون والاقتصاد لجميع السداسيات' },
      { name: 'كلية العلوم السملالية - مراكش', desc: 'امتحانات الرياضيات، الفيزياء، الكيمياء، والبيولوجيا' },
      { name: 'كلية الآداب والعلوم الإنسانية - مراكش', desc: 'امتحانات اللغات والتاريخ والجغرافيا والفلسفة' }
    ],
    faqs: [
      {
        q: 'أين أجد امتحانات كلية الحقوق مراكش مع التصحيح؟',
        a: 'تجد جميع نماذج امتحانات جامعة القاضي عياض مصنفة حسب الدورة والمادة والفصل مع الحلول في منصة ExamMaroc.'
      }
    ]
  },
  {
    slug: 'sidi-mohamed-ben-abdellah',
    name_ar: 'جامعة سيدي محمد بن عبد الله',
    city_ar: 'فاس',
    title: 'امتحانات جامعة سيدي محمد بن عبد الله بفاس 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات جامعة سيدي محمد بن عبد الله بفاس (ظهر المهراز، أكدال) بصيغة PDF مع عناصر الإجابة والتصحيح.',
    keywords: 'امتحانات جامعة فاس, امتحانات كلية الحقوق ظهر المهراز, امتحانات كلية الاداب ظهر المهراز',
    h1: 'امتحانات جامعة سيدي محمد بن عبد الله بفاس 2026',
    lead: 'نماذج امتحانات كليات جامعة فاس ظهر المهراز وأكدال لجميع المسالك والفصول بصيغة PDF مجاناً.',
    faculties: [
      { name: 'كلية العلوم القانونية والاقتصادية - فاس ظهر المهراز', desc: 'امتحانات القانون والاقتصاد' },
      { name: 'كلية الآداب والعلوم الإنسانية - فاس سايس', desc: 'امتحانات اللغات والعلوم الإنسانية' }
    ],
    faqs: []
  },
  {
    slug: 'abdelmalek-essaadi',
    name_ar: 'جامعة عبد المالك السعدي',
    city_ar: 'طنجة وتطوان',
    title: 'امتحانات جامعة عبد المالك السعدي بطنجة وتطوان 2026 PDF | ExamMaroc',
    description: 'امتحانات كليات جامعة عبد المالك السعدي بطنجة وتطوان والعرائش والحسيمة بصيغة PDF مع التصحيح.',
    keywords: 'امتحانات جامعة عبد المالك السعدي, امتحانات كلية الحقوق طنجة, امتحانات كلية الاداب تطوان',
    h1: 'امتحانات جامعة عبد المالك السعدي بطنجة وتطوان 2026',
    lead: 'نماذج امتحانات جامعة عبد المالك السعدي لجميع المسالك والفصول مع عناصر الإجابة والحلول المعتمدة.',
    faculties: [
      { name: 'كلية العلوم القانونية والاقتصادية - طنجة', desc: 'امتحانات القانون والاقتصاد' },
      { name: 'كلية العلوم - تطوان', desc: 'امتحانات العلوم الدقيقة والطبيعية' }
    ],
    faqs: []
  },
  {
    slug: 'moulay-ismail',
    name_ar: 'جامعة مولاي إسماعيل',
    city_ar: 'مكناس',
    title: 'امتحانات جامعة مولاي إسماعيل بمكناس 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات جامعة مولاي إسماعيل بمكناس والرشيدية لجميع السداسيات مع الحلول بصيغة PDF.',
    keywords: 'امتحانات جامعة مكناس, امتحانات كلية الحقوق مكناس, امتحانات FSJES مكناس',
    h1: 'امتحانات جامعة مولاي إسماعيل بمكناس 2026',
    lead: 'أرشيف امتحانات جامعة مولاي إسماعيل بمكناس والرشيدية لجميع التخصصات والفصول.',
    faculties: [],
    faqs: []
  },
  {
    slug: 'mohammed-premier',
    name_ar: 'جامعة محمد الأول',
    city_ar: 'وجدة والناظور',
    title: 'امتحانات جامعة محمد الأول بوجدة 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات وجدة والناظور لجميع الأسلاك والفصول مع عناصر الإجابة بصيغة PDF.',
    keywords: 'امتحانات جامعة وجدة, امتحانات كلية الحقوق وجدة, امتحانات كلية سلوان الناظور',
    h1: 'امتحانات جامعة محمد الأول بوجدة 2026',
    lead: 'أرشيف امتحانات جامعة محمد الأول بوجدة والناظور لجميع التخصصات والفصول.',
    faculties: [],
    faqs: []
  },
  {
    slug: 'ibn-tofail',
    name_ar: 'جامعة ابن طفيل',
    city_ar: 'القنيطرة',
    title: 'امتحانات جامعة ابن طفيل بالقنيطرة 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات جامعة ابن طفيل بالقنيطرة مع عناصر الإجابة والحلول بصيغة PDF.',
    keywords: 'امتحانات جامعة القنيطرة, امتحانات كلية الحقوق القنيطرة, امتحانات FSJES Kenitra',
    h1: 'امتحانات جامعة ابن طفيل بالقنيطرة 2026',
    lead: 'أرشيف امتحانات جامعة ابن طفيل بالقنيطرة لجميع المسالك والفصول.',
    faculties: [],
    faqs: []
  },
  {
    slug: 'chouaib-doukkali',
    name_ar: 'جامعة شعيب الدكالي',
    city_ar: 'الجديدة',
    title: 'امتحانات جامعة شعيب الدكالي بالجديدة 2026 مع التصحيح PDF | ExamMaroc',
    description: 'امتحانات كليات جامعة شعيب الدكالي بالجديدة مع التصحيح وسلم التنقيط PDF.',
    keywords: 'امتحانات جامعة الجديدة, امتحانات كلية الحقوق الجديدة, امتحانات FSJES El Jadida',
    h1: 'امتحانات جامعة شعيب الدكالي بالجديدة 2026',
    lead: 'نماذج امتحانات جامعة شعيب الدكالي بالجديدة لجميع التخصصات.',
    faculties: [],
    faqs: []
  },
  {
    slug: 'sultan-moulay-slimane',
    name_ar: 'جامعة السلطان مولاي سليمان',
    city_ar: 'بني ملال',
    title: 'امتحانات جامعة السلطان مولاي سليمان ببني ملال 2026 PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات بني ملال وخريبكة والفقيه بن صالح مع التصحيح PDF.',
    keywords: 'امتحانات جامعة بني ملال, امتحانات كلية الحقوق بني ملال',
    h1: 'امتحانات جامعة السلطان مولاي سليمان ببني ملال 2026',
    lead: 'نماذج امتحانات جامعة السلطان مولاي سليمان ببني ملال وخريبكة.',
    faculties: [],
    faqs: []
  },
  {
    slug: 'hassan-premier',
    name_ar: 'جامعة الحسن الأول',
    city_ar: 'سطات',
    title: 'امتحانات جامعة الحسن الأول بسطات 2026 مع التصحيح PDF | ExamMaroc',
    description: 'نماذج امتحانات كليات سطات وبرشيد مع التصحيح وسلم التنقيط PDF.',
    keywords: 'امتحانات جامعة سطات, امتحانات كلية الحقوق سطات, امتحانات FSJES Settat',
    h1: 'امتحانات جامعة الحسن الأول بسطات 2026',
    lead: 'نماذج امتحانات جامعة الحسن الأول بسطات وبرشيد لجميع التخصصات.',
    faculties: [],
    faqs: []
  }
];

function generateHtmlForRoute({
  url,
  title,
  description,
  keywords,
  h1,
  lead,
  faculties = [],
  faqs = [],
  extraHtml = ''
}) {
  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`
  );

  // Replace Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`
  );

  // Replace Open Graph
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );

  // Schema generation
  const schemas = [];

  // Breadcrumb Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://exammaroc.online/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الجامعات المغربية",
        "item": "https://exammaroc.online/universites"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title.split('|')[0].trim(),
        "item": url
      }
    ]
  });

  // Educational Organization Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": title.split('|')[0].trim(),
    "url": url,
    "description": description
  });

  // FAQ Schema if available
  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    });
  }

  const schemaHtml = schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');

  // Insert Schema into <head>
  html = html.replace('</head>', `${schemaHtml}\n</head>`);

  // Build semantic fallback HTML inside <div id="root"> so crawlers instantly see the content
  const facultiesHtml = faculties.length > 0 ? `
    <section style="margin-top: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #0f172a;">الكليات والمدارس التابعة</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${faculties.map(f => `
          <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #ffffff;">
            <h3 style="font-weight: 700; font-size: 1.1rem; color: #1e293b; margin-bottom: 0.5rem;">${f.name}</h3>
            <p style="font-size: 0.875rem; color: #64748b;">${f.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  const faqsHtml = faqs.length > 0 ? `
    <section style="margin-top: 2.5rem; background: #f8fafc; padding: 1.5rem; border-radius: 0.75rem;">
      <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #0f172a;">دليل وإرشادات الامتحانات (الأسئلة الشائعة)</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${faqs.map(f => `
          <div style="background: white; padding: 1rem 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${f.q}</h3>
            <p style="font-size: 0.925rem; color: #475569; line-height: 1.6;">${f.a}</p>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  const bodyContent = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <nav style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
        <a href="/" style="color: #2563eb; text-decoration: none;">الرئيسية</a> &gt; 
        <a href="/universites" style="color: #2563eb; text-decoration: none;">الجامعات المغربية</a> &gt; 
        <span>${title.split('|')[0].trim()}</span>
      </nav>
      <header style="margin-bottom: 2rem;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; line-height: 1.3;">${h1}</h1>
        <p style="font-size: 1.125rem; color: #475569; margin-top: 0.75rem; line-height: 1.7;">${lead}</p>
      </header>
      ${extraHtml}
      ${facultiesHtml}
      ${faqsHtml}
      <div style="margin-top: 3rem; text-align: center; padding: 2rem; background: #eff6ff; border-radius: 1rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e40af;">تحميل جميع نماذج الامتحانات بصيغة PDF</h2>
        <p style="color: #3b82f6; margin-top: 0.5rem;">تصفح آلاف الامتحانات الرسمية المحلولة مع سلم التنقيط</p>
        <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/examens" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">تصفح كافة الامتحانات</a>
          <a href="/examens-corriges" style="background: white; color: #2563eb; border: 1px solid #2563eb; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">الامتحانات المصححة</a>
        </div>
      </div>
    </div>
  `;

  // Inject semantic fallback inside <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

  return html;
}

function writeRoute(routePath, htmlContent) {
  const targetDir = path.join(distDir, routePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const filePath = path.join(targetDir, 'index.html');
  fs.writeFileSync(filePath, htmlContent, 'utf-8');
  console.log(`Generated pre-rendered route: ${routePath}/index.html`);
}

// 1. Generate Universites for all 12 universities
for (const uni of universitiesData) {
  const uniHtml = generateHtmlForRoute({
    url: `https://exammaroc.online/universites/${uni.slug}`,
    title: uni.title,
    description: uni.description,
    keywords: uni.keywords || '',
    h1: uni.h1,
    lead: uni.lead,
    faculties: uni.faculties,
    faqs: uni.faqs,
    extraHtml: uni.dates ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-right: 4px solid #f59e0b; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 2rem;">
        <h2 style="font-weight: 700; color: #92400e; font-size: 1.1rem; margin-bottom: 0.5rem;">📅 مواعيد وتواريخ الامتحانات الرسمية 2026 (${uni.name_ar})</h2>
        <ul style="list-style: disc; margin-right: 1.5rem; color: #78350f; font-size: 0.95rem; line-height: 1.8;">
          <li>توقف الدراسة للدورة الربيعية: <strong>${uni.dates.springStop}</strong></li>
          <li>انطلاق امتحانات الدورة الربيعية العادية: <strong>${uni.dates.springStart}</strong></li>
          <li>امتحانات الدورة الخريفية: <strong>${uni.dates.autumnStart}</strong></li>
        </ul>
      </div>
    ` : ''
  });

  writeRoute(`universites/${uni.slug}`, uniHtml);

  // Special high-priority dedicated landing routes for Ibn Zohr
  if (uni.slug === 'ibn-zohr') {
    writeRoute('examens-ibn-zohr', uniHtml);
    writeRoute('guide-examens-ibn-zohr', uniHtml);
  }
}

// 2. Main static directory routes
const staticPages = [
  {
    path: 'universites',
    title: 'دليل الجامعات المغربية الـ 12 - امتحانات ونماذج رسمية | ExamMaroc',
    description: 'دليل جميع الجامعات والكليات والمدارس العليا بالمغرب: جامعة ابن زهر، محمد الخامس، الحسن الثاني، القاضي عياض مع نماذج الامتحانات الرسمية والتصحيح PDF.',
    h1: 'الجامعات والكليات المغربية',
    lead: 'اختر جامعتك وتصفح آلاف الامتحانات الرسمية والحلول النموذجية المعتمدة لكافة المسالك والفصول.'
  },
  {
    path: 'examens',
    title: 'امتحانات الجامعات المغربية مع التصحيح PDF | ExamMaroc',
    description: 'أكبر مستودع رقمي لامتحانات الجامعات المغربية لجميع الفصول S1, S2, S3, S4, S5, S6 بصيغة PDF قابلة للتحميل والطباعة مباشرة مجاناً.',
    h1: 'مستودع امتحانات الجامعات المغربية',
    lead: 'ابحث وحمّل امتحانات جميع الكليات والمعاهد العليا المغربية مع الحلول وسلم التنقيط.'
  },
  {
    path: 'examens-corriges',
    title: 'امتحانات مصححة لجميع كليات المغرب بصيغة PDF | ExamMaroc',
    description: 'نماذج امتحانات جامعية مصححة مع عناصر الإجابة وسلم التنقيط لطلبة القانون والاقتصاد والآداب والعلوم والمدارس العليا.',
    h1: 'الامتحانات المصححة وعناصر الإجابة الرسمية',
    lead: 'راجع وحضّر لامتحاناتك الجامعية بنماذج مصححة خطوة بخطوة مع أساتذة محاضرين.'
  },
  {
    path: 'etablissements',
    title: 'كليات ومدارس ومعاهد التعليم العالي بالمغرب | ExamMaroc',
    description: 'دليل المؤسسات الجامعية بالمغرب: كليات الحقوق والاقتصاد FSJES، الآداب FLSH، العلوم FS، والمدارس العليا ENCG, ENSA, EST مع الامتحانات.',
    h1: 'المؤسسات والكليات الجامعية بالمغرب',
    lead: 'تصفح قائمة المؤسسات التابعة لوزارة التعليم العالي والبحث العلمي والابتكار.'
  },
  {
    path: 'facultes',
    title: 'كليات المغرب - دليل وشعب وامتحانات الكليات | ExamMaroc',
    description: 'دليل كليات المغرب لجميع التخصصات: القانون، الاقتصاد، الآداب، والعلوم، مع نماذج الامتحانات المعتمدة والتصحيح.',
    h1: 'دليل كليات التعليم العالي بالمغرب',
    lead: 'امتحانات وشعب ونماذج اختبارات كافة الكليات المغربية.'
  }
];

for (const p of staticPages) {
  const pageHtml = generateHtmlForRoute({
    url: `https://exammaroc.online/${p.path}`,
    title: p.title,
    description: p.description,
    h1: p.h1,
    lead: p.lead
  });
  writeRoute(p.path, pageHtml);
}

console.log('Static pre-rendering completed successfully!');
