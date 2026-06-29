import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { BlogPost } from '../data/blogPosts';

const SITE_NAME = 'FileBrother';
const SITE_URL = 'https://filebrother.com';
const DEFAULT_IMAGE = `${SITE_URL}/filebrother-logo.png`;

type SeoPage = {
  title: string;
  description: string;
  keywords: string[];
  type?: 'website' | 'tool' | 'article';
};

const pages: Record<string, SeoPage> = {
  '/': {
    title: 'Free Online PDF Converter & PDF Tools | FileBrother',
    description: 'Convert, merge, split, compress, edit, sign, protect and unlock PDF files online with FileBrother’s fast, simple document tools.',
    keywords: ['free PDF converter', 'online PDF tools', 'PDF editor online', 'convert PDF online', 'FileBrother'],
  },
  '/search': {
    title: 'Search FileBrother Tools, File Guides & Blog Articles',
    description: 'Search FileBrother tools, file extension guides, blog articles, and format help with instant results, filters, and typo-friendly matching.',
    keywords: ['FileBrother search', 'search PDF tools', 'file guide search', 'document tool search'],
  },
  '/tools': {
    title: 'All Online PDF & Document Tools | FileBrother',
    description: 'Browse all FileBrother PDF and document tools including PDF to Word, Word to PDF, merge, split, compress, sign, protect, and unlock PDF.',
    keywords: ['PDF tools directory', 'online document tools', 'all FileBrother tools', 'free PDF tools'],
  },
  '/tools/pdf-to-word': {
    title: 'PDF to Word Converter Online Free | FileBrother',
    description: 'Convert PDF files to editable Word documents online. Use FileBrother’s fast PDF to DOCX converter with a simple upload and download workflow.',
    keywords: ['PDF to Word', 'PDF to DOCX', 'convert PDF to Word', 'free PDF to Word converter', 'PDF converter online'],
    type: 'tool',
  },
  '/tools/word-to-pdf': {
    title: 'Word to PDF Converter Online Free | FileBrother',
    description: 'Convert Word DOC and DOCX documents to PDF online with FileBrother. Create an easy-to-share PDF from your Word file in a few steps.',
    keywords: ['Word to PDF', 'DOCX to PDF', 'DOC to PDF', 'convert Word to PDF', 'free Word to PDF converter'],
    type: 'tool',
  },
  '/tools/compress-pdf': {
    title: 'Compress PDF Online Free – Reduce PDF Size | FileBrother',
    description: 'Compress PDF files online to reduce file size for email, upload and sharing while keeping your document practical and readable.',
    keywords: ['compress PDF', 'reduce PDF size', 'PDF compressor online', 'shrink PDF file', 'compress PDF free'],
    type: 'tool',
  },
  '/tools/merge-pdf': {
    title: 'Merge PDF Online Free – Combine PDF Files | FileBrother',
    description: 'Merge multiple PDF files into one document online. Arrange your files in the preferred order and download one combined PDF.',
    keywords: ['merge PDF', 'combine PDF files', 'join PDF online', 'PDF merger free', 'merge multiple PDFs'],
    type: 'tool',
  },
  '/tools/split-pdf': {
    title: 'Split PDF Online Free – Extract PDF Pages | FileBrother',
    description: 'Split a PDF online and extract the pages you need. Select PDF pages and create a separate document quickly with FileBrother.',
    keywords: ['split PDF', 'extract PDF pages', 'separate PDF pages', 'PDF splitter online', 'split PDF free'],
    type: 'tool',
  },
  '/tools/sign-pdf': {
    title: 'Sign PDF Online Free – Add a Signature | FileBrother',
    description: 'Add a visual signature to PDF documents online. Place your signature on selected pages, preview the result and download the signed PDF.',
    keywords: ['sign PDF online', 'add signature to PDF', 'electronic PDF signature', 'eSign PDF', 'sign PDF free'],
    type: 'tool',
  },
  '/tools/edit-pdf': {
    title: 'Edit PDF Online Free – Add Text and Images | FileBrother',
    description: 'Edit PDF files online by adding text, images, shapes and drawings. Preview your changes and download the updated PDF document.',
    keywords: ['edit PDF online', 'PDF editor free', 'add text to PDF', 'annotate PDF', 'online PDF editor'],
    type: 'tool',
  },
  '/tools/pptx-to-pdf': {
    title: 'PowerPoint to PDF Converter Online | FileBrother',
    description: 'Convert PowerPoint PPT and PPTX presentations to PDF online for convenient viewing, printing and sharing across devices.',
    keywords: ['PowerPoint to PDF', 'PPTX to PDF', 'PPT to PDF', 'convert presentation to PDF', 'PowerPoint converter'],
    type: 'tool',
  },
  '/tools/xlsx-to-csv': {
    title: 'XLSX to CSV Converter Online Free | FileBrother',
    description: 'Convert Excel XLS and XLSX spreadsheets to CSV online in your browser. Choose a worksheet and download clean CSV data quickly.',
    keywords: ['XLSX to CSV', 'Excel to CSV', 'XLS to CSV', 'spreadsheet converter', 'convert XLSX online'],
    type: 'tool',
  },
  '/tools/excel-to-pdf': {
    title: 'Excel to PDF Converter Online Free | FileBrother',
    description: 'Convert Excel XLS and XLSX spreadsheets to PDF online. Turn worksheets into convenient PDF documents for sharing and printing.',
    keywords: ['Excel to PDF', 'XLSX to PDF', 'XLS to PDF', 'convert spreadsheet to PDF', 'Excel PDF converter'],
    type: 'tool',
  },
  '/tools/unlock-pdf': {
    title: 'Unlock PDF Online – Remove PDF Password | FileBrother',
    description: 'Unlock a PDF you are authorized to access by removing its password protection, then download the unlocked document.',
    keywords: ['unlock PDF', 'remove PDF password', 'PDF password remover', 'decrypt PDF', 'unlock protected PDF'],
    type: 'tool',
  },
  '/tools/protect-pdf': {
    title: 'Protect PDF Online – Add a PDF Password | FileBrother',
    description: 'Password-protect PDF files online to help prevent unauthorized access. Add encryption and download your secured PDF document.',
    keywords: ['protect PDF', 'password protect PDF', 'lock PDF', 'encrypt PDF online', 'secure PDF file'],
    type: 'tool',
  },
  '/about': {
    title: 'About FileBrother – Simple Online PDF Tools',
    description: 'Learn about FileBrother and our mission to provide simple, useful tools for converting, editing, compressing and securing documents.',
    keywords: ['about FileBrother', 'FileBrother PDF tools', 'online document tools'],
  },
  '/contact': {
    title: 'Contact FileBrother Support',
    description: 'Contact FileBrother for help with PDF tools, account questions, privacy requests, feedback or technical support.',
    keywords: ['FileBrother support', 'contact FileBrother', 'PDF tool help'],
  },
  '/faq': {
    title: 'PDF Tools FAQ and Help | FileBrother',
    description: 'Find answers about FileBrother file formats, uploads, downloads, PDF conversion, privacy, security and troubleshooting.',
    keywords: ['PDF converter FAQ', 'FileBrother help', 'PDF tools support', 'document conversion help'],
  },
  '/blog': {
    title: 'File Format Guides – PDF, DOCX & More | FileBrother',
    description: 'Explore clear file format guides and learn how to open, use, edit, and convert PDF, DOCX, and other common document files.',
    keywords: ['file format guides', 'PDF guide', 'DOCX guide', 'document conversion help'],
  },
  '/privacy': {
    title: 'Privacy Policy | FileBrother',
    description: 'Read the FileBrother privacy policy and learn how information and uploaded documents are handled when you use our services.',
    keywords: ['FileBrother privacy policy', 'PDF upload privacy', 'document privacy'],
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions | FileBrother',
    description: 'Read the terms and conditions that apply when using the FileBrother website and its online document tools.',
    keywords: ['FileBrother terms', 'FileBrother conditions', 'PDF tools terms of use'],
  },
};

const legacyToolRedirects: Record<string, string> = {
  '/pdf-to-word': '/tools/pdf-to-word',
  '/word-to-pdf': '/tools/word-to-pdf',
  '/compress-pdf': '/tools/compress-pdf',
  '/merge-pdf': '/tools/merge-pdf',
  '/split-pdf': '/tools/split-pdf',
  '/sign-pdf': '/tools/sign-pdf',
  '/edit-pdf': '/tools/edit-pdf',
  '/pptx-to-pdf': '/tools/pptx-to-pdf',
  '/xlsx-to-csv': '/tools/xlsx-to-csv',
  '/excel-to-pdf': '/tools/excel-to-pdf',
  '/unlock-pdf': '/tools/unlock-pdf',
  '/protect-pdf': '/tools/protect-pdf',
};

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    const [name, key] = attribute === 'property' ? ['property', selector.match(/"(.+)"/)?.[1]] : ['name', selector.match(/"(.+)"/)?.[1]];
    if (key) element.setAttribute(name, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

function setCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function createStructuredData(pathname: string, page: SeoPage, article?: BlogPost) {
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      inLanguage: 'en',
    },
  ];

  if (page.type === 'tool') {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${url}#application`,
      name: page.title.split('|')[0].trim(),
      url,
      description: page.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires a modern web browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@id': `${SITE_URL}/#organization` },
    });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.title.split('|')[0].trim(), item: url },
      ],
    });
  }

  if (article) {
    graph.push({
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: article.h1,
      name: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      image: DEFAULT_IMAGE,
      inLanguage: 'en',
    });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: article.shortTitle, item: url },
      ],
    });
    graph.push({
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let isCurrent = true;

    const updateSeo = async () => {
    const normalizedPath = pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
    const canonicalPath = legacyToolRedirects[normalizedPath] ?? normalizedPath;
    const articleSlug = canonicalPath.startsWith('/blog/') ? canonicalPath.slice('/blog/'.length) : '';
    const article = articleSlug
      ? (await import('../data/blogPosts')).getBlogPost(articleSlug)
      : undefined;
    if (!isCurrent) return;

    const staticPage = pages[canonicalPath];
    const page: SeoPage = article ? {
      title: article.title,
      description: article.description,
      keywords: article.keywords,
      type: 'article',
    } : staticPage ?? {
      title: 'Page Not Found | FileBrother',
      description: 'The requested FileBrother page could not be found.',
      keywords: [],
    };
    const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`;
    const shouldIndex = Boolean(staticPage || article?.seoReady);

    document.title = page.title;
    setMeta('meta[name="description"]', 'name', page.description);
    setMeta('meta[name="keywords"]', 'name', page.keywords.join(', '));
    setMeta(
      'meta[name="robots"]',
      'name',
      shouldIndex ? 'index, follow, max-image-preview:large' : article ? 'noindex, follow' : 'noindex, nofollow',
    );
    setMeta('meta[property="og:type"]', 'property', article ? 'article' : 'website');
    setMeta('meta[property="og:site_name"]', 'property', SITE_NAME);
    setMeta('meta[property="og:title"]', 'property', page.title);
    setMeta('meta[property="og:description"]', 'property', page.description);
    setMeta('meta[property="og:url"]', 'property', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', DEFAULT_IMAGE);
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', page.title);
    setMeta('meta[name="twitter:description"]', 'name', page.description);
    setMeta('meta[name="twitter:image"]', 'name', DEFAULT_IMAGE);
    setCanonical(canonicalUrl);

    document.head.querySelector('#route-structured-data')?.remove();
    if (shouldIndex) {
      const structuredData = document.createElement('script');
      structuredData.id = 'route-structured-data';
      structuredData.type = 'application/ld+json';
      structuredData.text = JSON.stringify(createStructuredData(canonicalPath, page, article));
      document.head.appendChild(structuredData);
    }
    };

    updateSeo();

    return () => {
      isCurrent = false;
    };
  }, [pathname]);

  return null;
};

export default SeoManager;
