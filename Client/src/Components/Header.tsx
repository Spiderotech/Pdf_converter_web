import { useState } from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { To, useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiChevronDown,
  FiEdit3,
  FiGrid,
  FiMenu,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';
import compressPdfIcon from '../assets/hero-icons/compress-pdf.png';
import editPdfIcon from '../assets/hero-icons/edit-pdf.png';
import excelPdfIcon from '../assets/hero-icons/excel-pdf.png';
import mergePdfIcon from '../assets/hero-icons/merge-pdf.png';
import pdfWordIcon from '../assets/hero-icons/pdf-word.png';
import pptPdfIcon from '../assets/hero-icons/ppt-pdf.png';
import protectPdfIcon from '../assets/hero-icons/lock-pdf.png';
import signPdfIcon from '../assets/hero-icons/sign-pdf.png';
import splitPdfIcon from '../assets/hero-icons/split-pdf.png';
import unlockPdfIcon from '../assets/hero-icons/unlock-pdf.png';
import wordPdfIcon from '../assets/hero-icons/word-pdf.png';
import xlsxCsvIcon from '../assets/hero-icons/xlsx-csv.png';
import fileBrotherLogo from '../assets/filebrother-logo.png';

type ToolLink = {
  name: string;
  description: string;
  href: string;
  icon: string;
};

type DropdownGroup = {
  name: string;
  icon: typeof FiGrid;
  href: string;
  items: ToolLink[];
};

const dropdownGroups: DropdownGroup[] = [
  {
    name: 'Tools',
    icon: FiBriefcase,
    href: '#tools',
    items: [
      { name: 'Merge PDF', description: 'Combine multiple PDFs into one file.', href: '/merge-pdf', icon: mergePdfIcon },
      { name: 'Split PDF', description: 'Extract pages or split a PDF.', href: '/split-pdf', icon: splitPdfIcon },
      { name: 'Compress PDF', description: 'Reduce PDF file size quickly.', href: '/compress-pdf', icon: compressPdfIcon },
      { name: 'Sign PDF', description: 'Place a visual signature on a PDF.', href: '/sign-pdf', icon: signPdfIcon },
    ],
  },
  {
    name: 'Convert',
    icon: FiRefreshCw,
    href: '/pdf-to-word',
    items: [
      { name: 'PDF to Word', description: 'Turn PDF files into editable DOCX.', href: '/pdf-to-word', icon: pdfWordIcon },
      { name: 'Word to PDF', description: 'Convert DOCX documents to PDF.', href: '/word-to-pdf', icon: wordPdfIcon },
      { name: 'Excel to PDF', description: 'Export spreadsheets as PDF files.', href: '/excel-to-pdf', icon: excelPdfIcon },
      { name: 'PPTX to PDF', description: 'Convert presentations to PDF.', href: '/pptx-to-pdf', icon: pptPdfIcon },
      { name: 'XLSX to CSV', description: 'Export spreadsheet data as CSV.', href: '/xlsx-to-csv', icon: xlsxCsvIcon },
    ],
  },
  {
    name: 'Edit',
    icon: FiEdit3,
    href: '/edit-pdf',
    items: [
      { name: 'Edit PDF', description: 'Add text, shapes, images, and drawings.', href: '/edit-pdf', icon: editPdfIcon },
      { name: 'Sign PDF', description: 'Upload or draw a signature.', href: '/sign-pdf', icon: signPdfIcon },
      { name: 'Merge PDF', description: 'Reorder and combine PDF files.', href: '/merge-pdf', icon: mergePdfIcon },
      { name: 'Split PDF', description: 'Select pages and create new PDFs.', href: '/split-pdf', icon: splitPdfIcon },
    ],
  },
  {
    name: 'Protection',
    icon: FiShield,
    href: '/protect-pdf',
    items: [
      { name: 'Protect PDF', description: 'Add password protection to a PDF.', href: '/protect-pdf', icon: protectPdfIcon },
      { name: 'Unlock PDF', description: 'Remove a known PDF password.', href: '/unlock-pdf', icon: unlockPdfIcon },
    ],
  },
];

const utilityLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

const Header = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const activeGroup = dropdownGroups.find((group) => group.name === activeDropdown);

  const handleNavigation = (path: To | string) => {
    setActiveDropdown(null);

    if (typeof path === 'string' && path.startsWith('#')) {
      document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(path as To);
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-[80] bg-[#fbf7ef]/80 px-3 py-3 backdrop-blur-xl sm:px-5 lg:px-8">
      {({ open }) => (
        <>
          <div
            className="relative mx-auto max-w-[1720px]"
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex min-h-[78px] items-center justify-between gap-4 rounded-[1.75rem] border border-white/70 bg-white/82 px-4 py-3 shadow-[0_18px_50px_rgba(86,63,28,0.10)] ring-1 ring-stone-200/60 backdrop-blur-xl sm:px-6">
              <button
                type="button"
                onClick={() => handleNavigation('/')}
                className="group flex shrink-0 items-center gap-4 text-left"
                aria-label="Go to FileBrother homepage"
              >
                <img
                  src={fileBrotherLogo}
                  alt=""
                  aria-hidden="true"
                  className="h-14 w-14 shrink-0 object-contain drop-shadow-lg transition group-hover:-translate-y-0.5"
                />
                <span className="hidden sm:block">
                  <span className="block text-[1.35rem] font-black leading-6 tracking-[-0.04em] text-slate-950">FileBrother</span>
                  <span className="mt-1 block text-sm font-bold text-slate-500">All-in-one PDF Tools</span>
                </span>
              </button>

              <span className="hidden h-11 w-px bg-stone-200 xl:block" />

              <div className="hidden flex-1 items-center justify-center gap-2 xl:flex">
                {dropdownGroups.map((group) => {
                  const Icon = group.icon;
                  const isActive = activeDropdown === group.name;

                  return (
                    <button
                      key={group.name}
                      type="button"
                      onMouseEnter={() => setActiveDropdown(group.name)}
                      onFocus={() => setActiveDropdown(group.name)}
                      onClick={() => handleNavigation(group.href)}
                      className={`inline-flex h-11 items-center gap-2.5 rounded-full border px-3.5 text-sm font-black transition ${
                        isActive
                          ? 'border-amber-100 bg-amber-50/80 text-slate-950 shadow-sm'
                          : 'border-transparent text-slate-800 hover:border-stone-200 hover:bg-stone-50/90 hover:text-slate-950'
                      }`}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#a56a0d] shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                      {group.name}
                      <FiChevronDown className={`h-4 w-4 text-slate-500 transition ${isActive ? 'rotate-180 text-[#a56a0d]' : ''}`} />
                    </button>
                  );
                })}
              </div>

              <div className="hidden shrink-0 items-center gap-2 xl:flex">
                {utilityLinks.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigation(item.href)}
                    className="h-10 rounded-full px-3 text-sm font-black text-slate-600 transition hover:bg-stone-50 hover:text-slate-950"
                  >
                    {item.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNavigation('/pdf-to-word')}
                  className="group inline-flex h-12 items-center gap-3 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-[#8a5a12] px-5 text-sm font-black text-white shadow-[0_18px_35px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(120,83,27,0.24)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-amber-100 transition group-hover:bg-white group-hover:text-slate-950">
                    <FiUploadCloud className="h-4 w-4" />
                  </span>
                  Upload PDF
                </button>
              </div>

              <DisclosureButton className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white/80 text-slate-700 hover:bg-stone-50 hover:text-slate-950 xl:hidden">
                <span className="sr-only">Open menu</span>
                {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </DisclosureButton>
            </div>

            {activeGroup && (
              <div className="absolute left-1/2 top-[calc(100%+0.35rem)] z-[90] hidden w-[620px] -translate-x-1/2 rounded-[1.35rem] border border-stone-200 bg-white/95 p-3 shadow-[0_28px_80px_rgba(15,23,42,0.22)] ring-1 ring-white/80 backdrop-blur-2xl xl:block">
                <div className="mb-2 flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6514]">{activeGroup.name} tools</span>
                  <span className="text-xs font-bold text-slate-400">Fast browser workflow</span>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-[1.1rem] bg-white">
                  {activeGroup.items.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavigation(item.href)}
                      className="group flex items-start gap-3 rounded-2xl border border-transparent p-3 text-left transition hover:border-stone-100 hover:bg-[#fbf7ef]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-100">
                        <img src={item.icon} alt="" aria-hidden="true" className="h-9 w-9 object-contain transition group-hover:scale-105" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-black text-slate-950 group-hover:text-[#9a6514]">{item.name}</span>
                        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-slate-500">{item.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DisclosurePanel className="mt-3 rounded-[1.35rem] border border-white/70 bg-white/92 p-3 shadow-xl shadow-stone-200/70 ring-1 ring-stone-200/60 backdrop-blur-xl xl:hidden">
            <div className="space-y-2">
              {dropdownGroups.map((group) => {
                const Icon = group.icon;

                return (
                  <details key={group.name} className="rounded-2xl border border-stone-200 bg-white/80">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-black text-slate-900">
                      <span className="inline-flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-[#a56a0d]">
                          <Icon className="h-4 w-4" />
                        </span>
                        {group.name}
                      </span>
                      <FiChevronDown className="h-4 w-4 text-slate-500" />
                    </summary>
                    <div className="border-t border-slate-100 p-1.5">
                      {group.items.map((item) => (
                        <DisclosureButton
                          key={item.href}
                          as="button"
                          onClick={() => handleNavigation(item.href)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-[#fbf7ef]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-stone-100">
                            <img src={item.icon} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
                          </span>
                          <span>
                            <span className="block text-[13px] font-extrabold text-slate-950">{item.name}</span>
                            <span className="mt-0.5 block text-[11px] font-medium leading-4 text-slate-500">{item.description}</span>
                          </span>
                        </DisclosureButton>
                      ))}
                    </div>
                  </details>
                );
              })}

              <div className="grid gap-2 sm:grid-cols-3">
                {utilityLinks.map((item) => (
                  <DisclosureButton
                    key={item.href}
                    as="button"
                    onClick={() => handleNavigation(item.href)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 text-sm font-black text-slate-700"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 text-sm font-black text-[#9a6514]"
                >
                  <FiStar className="h-5 w-5" />
                  Go Premium
                </button>
                <DisclosureButton
                  as="button"
                  onClick={() => handleNavigation('/pdf-to-word')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#8a5a12] px-4 text-sm font-black text-white"
                >
                  <FiUploadCloud className="h-5 w-5" />
                  Upload PDF
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
