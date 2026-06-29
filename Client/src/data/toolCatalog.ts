export type ToolCatalogItem = {
  name: string;
  description: string;
  path: string;
  category: 'Convert' | 'Edit' | 'Security' | 'Other';
  tags: string[];
};

export const toolCatalog: ToolCatalogItem[] = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single PDF.',
    path: '/tools/merge-pdf',
    category: 'Edit',
    tags: ['pdf', 'combine', 'join', 'merge', 'document'],
  },
  {
    name: 'Split PDF',
    description: 'Extract pages or split PDF files into multiple PDFs.',
    path: '/tools/split-pdf',
    category: 'Edit',
    tags: ['pdf', 'pages', 'extract', 'separate', 'document'],
  },
  {
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word DOCX documents.',
    path: '/tools/pdf-to-word',
    category: 'Convert',
    tags: ['pdf', 'word', 'docx', 'editable', 'document', 'converter'],
  },
  {
    name: 'XLSX to CSV',
    description: 'Convert spreadsheet data to CSV.',
    path: '/tools/xlsx-to-csv',
    category: 'Convert',
    tags: ['xlsx', 'xls', 'csv', 'excel', 'spreadsheet', 'data'],
  },
  {
    name: 'Word to PDF',
    description: 'Convert Word DOC and DOCX documents to PDF files.',
    path: '/tools/word-to-pdf',
    category: 'Convert',
    tags: ['word', 'doc', 'docx', 'pdf', 'document', 'converter'],
  },
  {
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF files.',
    path: '/tools/excel-to-pdf',
    category: 'Convert',
    tags: ['excel', 'xlsx', 'xls', 'pdf', 'spreadsheet', 'converter'],
  },
  {
    name: 'PPT to PDF',
    description: 'Convert PowerPoint PPT and PPTX presentations to PDF files.',
    path: '/tools/pptx-to-pdf',
    category: 'Convert',
    tags: ['ppt', 'pptx', 'powerpoint', 'presentation', 'pdf', 'converter'],
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size with lossless optimization.',
    path: '/tools/compress-pdf',
    category: 'Other',
    tags: ['pdf', 'compress', 'reduce', 'size', 'smaller', 'document'],
  },
  {
    name: 'Edit PDF',
    description: 'Add text, images, shapes or freehand annotations.',
    path: '/tools/edit-pdf',
    category: 'Edit',
    tags: ['pdf', 'edit', 'text', 'image', 'annotate', 'document'],
  },
  {
    name: 'Sign PDF',
    description: 'Add your signature to PDF documents.',
    path: '/tools/sign-pdf',
    category: 'Edit',
    tags: ['pdf', 'sign', 'signature', 'esign', 'document'],
  },
  {
    name: 'Lock PDF',
    description: 'Password protect your PDF files.',
    path: '/tools/protect-pdf',
    category: 'Security',
    tags: ['pdf', 'lock', 'protect', 'password', 'encrypt', 'security'],
  },
  {
    name: 'Unlock PDF',
    description: 'Remove known password protection from PDF files.',
    path: '/tools/unlock-pdf',
    category: 'Security',
    tags: ['pdf', 'unlock', 'password', 'decrypt', 'security'],
  },
];

export const popularTools = toolCatalog.filter((tool) => [
  '/tools/pdf-to-word',
  '/tools/compress-pdf',
  '/tools/merge-pdf',
  '/tools/split-pdf',
].includes(tool.path));
