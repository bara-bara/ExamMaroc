import { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'book';
  keywords?: string[];
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  jsonLd?: Record<string, unknown> | object[];
}

export default function SEO({
  title,
  description,
  canonical,
  image = 'https://exammaroc.online/favicon.png',
  type = 'website',
  keywords,
  breadcrumbs,
  faqs,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Helper to set/update meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Set standard SEO and OpenGraph tags
    setMeta('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMeta('name', 'keywords', keywords.join(', '));
    }

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'ExamMaroc');
    setMeta('property', 'og:locale', 'ar_MA');
    if (image) setMeta('property', 'og:image', image);

    const rawUrl = canonical || (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/');
    const fullCanonical = rawUrl.startsWith('http')
      ? rawUrl.replace(/https?:\/\/[^/]+/, 'https://exammaroc.online')
      : `https://exammaroc.online${rawUrl}`;
    setMeta('property', 'og:url', fullCanonical);

    // 4. Twitter tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);

    // 5. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullCanonical);

    // 6. Assemble JSON-LD schemas
    const schemas: object[] = [];

    // Custom or page-specific jsonLd
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemas.push(...jsonLd);
      } else {
        schemas.push(jsonLd);
      }
    }

    // Add BreadcrumbList schema if breadcrumbs are present
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url.startsWith('http')
            ? b.url.replace(/https?:\/\/[^/]+/, 'https://exammaroc.online')
            : `https://exammaroc.online${b.url.startsWith('/') ? '' : '/'}${b.url}`,
        })),
      });
    }

    // Add FAQPage schema if FAQs are provided
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    // Inject into DOM
    const oldScript = document.getElementById('page-jsonld');
    if (oldScript) oldScript.remove();

    if (schemas.length > 0) {
      const scriptTag = document.createElement('script');
      scriptTag.id = 'page-jsonld';
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : { '@context': 'https://schema.org', '@graph': schemas });
      document.head.appendChild(scriptTag);
    }

    return () => {
      const el = document.getElementById('page-jsonld');
      if (el) el.remove();
    };
  }, [title, description, canonical, image, type, keywords, breadcrumbs, faqs, jsonLd]);

  return null;
}
