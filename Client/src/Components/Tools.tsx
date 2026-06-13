import { To, useNavigate } from 'react-router-dom';
import {
  FiArchive,
  FiCopy,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiLock,
  FiMonitor,
  FiScissors,
  FiShield,
  FiUnlock,
} from 'react-icons/fi';

const tools = [
  {
    name: 'PDF to Word',
    description: 'Convert PDF files into editable Word documents.',
    path: '/pdf-to-word',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiFileText,
  },
  {
    name: 'Word to PDF',
    description: 'Create a clean PDF from DOC or DOCX files.',
    path: '/word-to-pdf',
    label: 'DOCX',
    accent: 'text-blue-600 bg-blue-50 border-blue-100',
    icon: FiFileText,
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size for easier sharing.',
    path: '/compress-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiArchive,
  },
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    path: '/merge-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiCopy,
  },
  {
    name: 'Split PDF',
    description: 'Extract pages or create smaller PDF files.',
    path: '/split-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiScissors,
  },
  {
    name: 'Sign PDF',
    description: 'Add a visual signature to a PDF document.',
    path: '/sign-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiEdit3,
  },
  {
    name: 'Edit PDF',
    description: 'Add text, images, and simple marks to a PDF.',
    path: '/edit-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiEdit3,
  },
  {
    name: 'PPTX to PDF',
    description: 'Convert presentation files into PDF documents.',
    path: '/pptx-to-pdf',
    label: 'PPTX',
    accent: 'text-orange-600 bg-orange-50 border-orange-100',
    icon: FiMonitor,
  },
  {
    name: 'XLSX to CSV',
    description: 'Export spreadsheet data into CSV format.',
    path: '/xlsx-to-csv',
    label: 'XLSX',
    accent: 'text-green-600 bg-green-50 border-green-100',
    icon: FiGrid,
  },
  {
    name: 'Excel to PDF',
    description: 'Convert spreadsheets into PDF documents.',
    path: '/excel-to-pdf',
    label: 'XLSX',
    accent: 'text-green-600 bg-green-50 border-green-100',
    icon: FiFileText,
  },
  {
    name: 'Unlock PDF',
    description: 'Unlock protected PDFs with the correct password.',
    path: '/unlock-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiUnlock,
  },
  {
    name: 'Protect PDF',
    description: 'Add password protection to sensitive PDF files.',
    path: '/protect-pdf',
    label: 'PDF',
    accent: 'text-red-600 bg-red-50 border-red-100',
    icon: FiLock,
  },
];

const Tools = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: To | string) => {
    if (path !== '#') {
      navigate(path as To);
    }
  };

  return (
    <section id="tools" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Popular tools</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Choose the document task you need</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Open the active converters or review the prepared screens for upcoming document tools.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.name}
                type="button"
                onClick={() => handleNavigation(tool.path)}
                className="group rounded-lg border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200 hover:shadow-sm disabled:cursor-default"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-md border ${tool.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                    {tool.label}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{tool.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{tool.description}</p>
                <p className="mt-4 text-sm font-semibold text-blue-600">Open screen</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <FiShield className="mt-0.5 h-5 w-5 flex-none text-green-600" />
          <p>
            Files should be processed temporarily and deleted after conversion. Avoid uploading files you are not allowed to process.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Tools;
