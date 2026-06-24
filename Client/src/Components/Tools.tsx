import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiGrid, FiSearch, FiX } from 'react-icons/fi';
import compressPdfIcon from '../assets/hero-icons/compress-pdf.webp';
import editPdfIcon from '../assets/hero-icons/edit-pdf.webp';
import excelPdfIcon from '../assets/hero-icons/excel-pdf.webp';
import mergePdfIcon from '../assets/hero-icons/merge-pdf.webp';
import pdfWordIcon from '../assets/hero-icons/pdf-word.webp';
import pptPdfIcon from '../assets/hero-icons/ppt-pdf.webp';
import secureIcon from '../assets/hero-icons/lock-pdf.webp';
import signPdfIcon from '../assets/hero-icons/sign-pdf.webp';
import splitPdfIcon from '../assets/hero-icons/split-pdf.webp';
import unlockPdfIcon from '../assets/hero-icons/unlock-pdf.webp';
import wordPdfIcon from '../assets/hero-icons/word-pdf.webp';
import xlsxCsvIcon from '../assets/hero-icons/xlsx-csv.webp';

const tools = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single PDF',
    path: '/merge-pdf',
    icon: mergePdfIcon,
    category: 'Edit',
  },
  {
    name: 'Split PDF',
    description: 'Extract pages or split PDF files into multiple PDFs',
    path: '/split-pdf',
    icon: splitPdfIcon,
    category: 'Edit',
  },
  {
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    path: '/pdf-to-word',
    icon: pdfWordIcon,
    category: 'Convert',
  },
  {
    name: 'XLSX to CSV',
    description: 'Convert PDF tables to Excel spreadsheets',
    path: '/xlsx-to-csv',
    icon: xlsxCsvIcon,
    category: 'Convert',
  },
  {
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF files',
    path: '/word-to-pdf',
    icon: wordPdfIcon,
    category: 'Convert',
  },
  {
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF files',
    path: '/excel-to-pdf',
    icon: excelPdfIcon,
    category: 'Convert',
  },
  {
    name: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF files',
    path: '/pptx-to-pdf',
    icon: pptPdfIcon,
    category: 'Convert',
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality',
    path: '/compress-pdf',
    icon: compressPdfIcon,
    category: 'Other',
  },
  {
    name: 'Edit PDF',
    description: 'Add text, images, shapes or freehand annotations',
    path: '/edit-pdf',
    icon: editPdfIcon,
    category: 'Edit',
  },
  {
    name: 'Sign PDF',
    description: 'Add your signature to PDF documents',
    path: '/sign-pdf',
    icon: signPdfIcon,
    category: 'Edit',
  },
  {
    name: 'Lock PDF',
    description: 'Password protect your PDF files',
    path: '/protect-pdf',
    icon: secureIcon,
    category: 'Security',
  },
  {
    name: 'Unlock PDF',
    description: 'Remove password protection from PDF files',
    path: '/unlock-pdf',
    icon: unlockPdfIcon,
    category: 'Security',
  },
];

const categories = ['All', 'Convert', 'Edit', 'Security', 'Other'];

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch =
        !normalizedQuery ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="tools" className="relative overflow-hidden bg-[#f7f5ef] pb-14 pt-2 sm:pb-20 sm:pt-2">
      <div className="absolute -left-28 bottom-20 h-56 w-56 rounded-full bg-stone-300/35 blur-3xl" />
      <div className="absolute -right-24 top-28 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="absolute right-8 top-28 hidden grid-cols-2 gap-3 lg:grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="h-2.5 w-2.5 rounded-full bg-stone-300" />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">
        <div className="pt-4 sm:pt-8 lg:pt-10">
          <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-950 sm:text-5xl">Popular Tools</h2>
              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600">
                Discover powerful tools to work with your PDF files. Fast, easy and 100% free.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(260px,340px)_auto]">
              <label className="relative block">
                <span className="sr-only">Search tools</span>
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-14 w-full rounded-xl border border-stone-200 bg-white/90 pl-12 pr-11 text-sm font-semibold text-slate-700 shadow-sm outline-none ring-stone-200 transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-4"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-stone-100 hover:text-slate-950"
                    aria-label="Clear tool search"
                    title="Clear search"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </label>

              <div className="flex min-h-14 max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white/90 p-1 shadow-sm">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition ${
                      activeCategory === category
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-stone-100 hover:text-slate-950'
                    }`}
                  >
                    {category === 'All' && <FiGrid className="h-5 w-5" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                className="group flex min-h-[118px] items-start gap-4 rounded-lg border border-stone-200 bg-white/95 p-4 text-left shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-200 sm:items-center sm:gap-5 sm:p-5"
              >
                <img src={tool.icon} alt="" aria-hidden="true" className="h-16 w-16 shrink-0 object-contain drop-shadow-lg sm:h-20 sm:w-20" />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black text-slate-950 sm:text-xl">{tool.name}</span>
                  <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">{tool.description}</span>
                </span>
                <FiArrowRight className="h-5 w-5 shrink-0 text-[#9a6514] transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="mt-10 flex min-h-52 flex-col items-center justify-center border-y border-stone-200 py-10 text-center">
              <FiSearch className="h-9 w-9 text-stone-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black text-slate-950">No tools found</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">Try another search or choose a different category.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-5 text-sm font-bold text-[#9a6514] transition hover:text-slate-950"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tools;
