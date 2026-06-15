import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiInfo,
  FiRefreshCw,
  FiScissors,
  FiUpload,
} from 'react-icons/fi';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';
import splitHeroPagesIcon from '../../assets/converter-icons/split-hero-pages.png';
import splitSecureShieldIcon from '../../assets/converter-icons/split-secure-shield.png';
import splitFastBoltIcon from '../../assets/converter-icons/split-fast-bolt.png';
import splitBrowserToolIcon from '../../assets/converter-icons/split-browser-tool.png';
import splitUploadPdfIcon from '../../assets/converter-icons/split-upload-pdf.png';
import splitSelectPagesIcon from '../../assets/converter-icons/split-select-pages.png';
import splitDownloadPagesIcon from '../../assets/converter-icons/split-download-pages.png';
import splitPrivateLockIcon from '../../assets/converter-icons/split-private-lock.png';
import splitPreviewPagesIcon from '../../assets/converter-icons/split-preview-pages.png';

const trustItems = [
  { title: '100% Secure', text: 'Files stay private', icon: splitSecureShieldIcon },
  { title: 'Fast & Easy', text: 'Split in seconds', icon: splitFastBoltIcon },
  { title: 'Works in Browser', text: 'No installation', icon: splitBrowserToolIcon },
];

const howItWorksSteps = [
  {
    title: 'Upload PDF',
    text: 'Choose or drag and drop the PDF file you want to split.',
    icon: splitUploadPdfIcon,
  },
  {
    title: 'Select pages',
    text: 'Enter the page range or specific page numbers you want to extract.',
    icon: splitSelectPagesIcon,
  },
  {
    title: 'Split & download',
    text: 'Click Split PDF and download your new PDF file instantly.',
    icon: splitDownloadPagesIcon,
  },
];

const parsePageRanges = (value: string, pageCount: number) => {
  const pages = new Set<number>();
  const ranges = value.split(',').map((part) => part.trim()).filter(Boolean);

  ranges.forEach((range) => {
    if (range.includes('-')) {
      const parts = range.split('-').map((part) => part.trim());
      if (parts.length !== 2) {
        throw new Error('Use ranges like 1-5 or individual pages like 1, 4, 7.');
      }

      const start = Number(parts[0]);
      const end = Number(parts[1]);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > pageCount || start > end) {
        throw new Error(`Enter pages between 1 and ${pageCount}.`);
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page - 1);
      }
      return;
    }

    const page = Number(range);
    if (!Number.isInteger(page) || page < 1 || page > pageCount) {
      throw new Error(`Enter pages between 1 and ${pageCount}.`);
    }
    pages.add(page - 1);
  });

  if (pages.size === 0) {
    throw new Error('Enter at least one page number.');
  }

  return [...pages].sort((a, b) => a - b);
};

const SplitPdfToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [previewPages, setPreviewPages] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setPdfFile = async (selectedFile: File) => {
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf || selectedFile.size > 25 * 1024 * 1024) {
      setError('Choose a PDF file that is 25 MB or smaller.');
      return;
    }

    setIsReading(true);
    setError('');
    setDownload(null);
    setPreviewPages([]);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
      const count = pdfDoc.getPageCount();
      setFile(selectedFile);
      setPageCount(count);
      setPageRange(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (readError) {
      console.error(readError);
      setError('This PDF could not be opened. It may be damaged or password protected.');
    } finally {
      setIsReading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setPdfFile(selectedFile);
    }
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      setPdfFile(selectedFile);
    }
  };

  const previewSelection = () => {
    if (!file) {
      setError('Upload a PDF file first.');
      return;
    }

    try {
      const pages = parsePageRanges(pageRange, pageCount);
      setPreviewPages(pages.map((page) => page + 1));
      setError('');
    } catch (rangeError) {
      setPreviewPages([]);
      setError(rangeError instanceof Error ? rangeError.message : 'Enter a valid page range.');
    }
  };

  const splitPdf = async () => {
    if (!file) {
      setError('Upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setDownload(null);
    setError('');

    try {
      const pageIndexes = parsePageRanges(pageRange, pageCount);
      const { PDFDocument } = await import('pdf-lib');
      const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const copiedPages = await outputPdf.copyPages(sourcePdf, pageIndexes);
      copiedPages.forEach((page) => outputPdf.addPage(page));

      const pdfBytes = new Uint8Array(await outputPdf.save());
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPreviewPages(pageIndexes.map((page) => page + 1));
      setDownload({ url: URL.createObjectURL(blob), name: 'split.pdf' });
    } catch (splitError) {
      console.error(splitError);
      setError(splitError instanceof Error ? splitError.message : 'This PDF could not be split.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Splitting your PDF" />
      <main className="relative overflow-hidden bg-[#fffafa] py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(254,226,226,0.6),transparent_26%),radial-gradient(circle_at_12%_75%,rgba(219,234,254,0.45),transparent_25%)]" />

        <section className="relative mx-auto max-w-[1720px] px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-extrabold uppercase text-red-600">PDF Split</p>
              <h1 className="mt-3 text-5xl font-black text-slate-950 sm:text-6xl">
                Split <span className="text-red-600">PDF</span>
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                Extract specific pages from your PDF using page ranges or individual page numbers.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                {trustItems.map(({ title, text, icon }) => (
                  <div key={title} className="flex items-center gap-3">
                    <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 object-contain drop-shadow-md" />
                    <span>
                      <strong className="block text-sm font-extrabold text-slate-950">{title}</strong>
                      <span className="text-xs font-medium text-slate-500">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <span className="absolute -inset-6 rounded-full bg-red-100/70 blur-2xl" />
                <img
                  src={splitHeroPagesIcon}
                  alt=""
                  aria-hidden="true"
                  className="relative h-72 w-80 object-contain drop-shadow-2xl sm:h-80 sm:w-96"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div>
              <div className="rounded-lg border border-red-100 bg-white p-5 shadow-[0_18px_50px_rgba(220,38,38,0.07)]">
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
                <div
                  className={`flex min-h-[285px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition ${
                    isDragging ? 'border-red-600 bg-red-50' : 'border-red-300'
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
                    {isReading ? (
                      <FiRefreshCw className="h-10 w-10 animate-spin" />
                    ) : (
                      <img src={splitUploadPdfIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain drop-shadow-md" />
                    )}
                  </span>
                  <h2 className="mt-5 text-xl font-extrabold text-slate-950">
                    {isReading ? 'Reading your PDF...' : file ? file.name : 'Drag & drop your PDF file here'}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500">{file ? `${pageCount} pages detected` : 'or'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isReading}
                    className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-8 text-sm font-extrabold text-white shadow-lg shadow-red-200 hover:bg-red-700 disabled:bg-red-300"
                  >
                    <FiUpload className="h-5 w-5" />
                    {file ? 'Replace PDF file' : 'Choose PDF file'}
                  </button>
                  <p className="mt-4 text-sm font-medium text-slate-500">Supports PDF files. Maximum file size: 25 MB.</p>
                </div>

                <div className="mt-4 flex items-start gap-4 rounded-lg border border-red-100 bg-red-50/70 px-5 py-4 text-sm font-medium text-slate-700">
                  <img src={splitPrivateLockIcon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain drop-shadow-sm" />
                  <p>Your files are processed locally in your browser. They are never uploaded to our servers.</p>
                </div>
              </div>

              <section className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
                <h2 className="inline-flex items-center gap-3 text-lg font-extrabold text-slate-950">
                  <img src={splitSelectPagesIcon} alt="" aria-hidden="true" className="h-10 w-10 object-contain drop-shadow-sm" />
                  Pages to extract
                </h2>
                <label htmlFor="splitPageRange" className="mt-4 block text-sm font-semibold text-slate-600">
                  Enter page range or page numbers
                </label>
                <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    id="splitPageRange"
                    value={pageRange}
                    onChange={(event) => {
                      setPageRange(event.target.value);
                      setPreviewPages([]);
                      setDownload(null);
                    }}
                    placeholder="Example: 1-5, 8, 11-13"
                    disabled={!file}
                    className="h-12 min-w-0 rounded-lg border border-slate-200 px-4 text-sm font-medium outline-none focus:border-red-400 disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={previewSelection}
                    disabled={!file}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiEye className="h-4 w-4" />
                    Preview
                  </button>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FiInfo className="h-4 w-4" />
                  Use ranges like 1-5, 8-10 or specific pages like 1, 4, 7.
                </p>

                {previewPages.length > 0 && (
                  <div className="mt-5 rounded-lg bg-red-50/60 p-4">
                    <p className="text-sm font-bold text-slate-800">{previewPages.length} page{previewPages.length === 1 ? '' : 's'} selected</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {previewPages.map((page) => (
                        <span key={page} className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-sm font-extrabold text-red-600">
                          {page}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={splitPdf}
                  disabled={!file || isProcessing}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-red-600 px-8 text-base font-extrabold text-white shadow-lg shadow-red-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : <FiScissors className="h-5 w-5" />}
                  {isProcessing ? 'Splitting...' : 'Split PDF'}
                  {!isProcessing && <FiArrowRight className="h-5 w-5" />}
                </button>
                {download && (
                  <a
                    href={download.url}
                    download={download.name}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 text-sm font-extrabold text-white hover:bg-emerald-600"
                  >
                    <FiDownload className="h-5 w-5" />
                    Download split PDF
                  </a>
                )}
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <img src={splitSecureShieldIcon} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
                  We do not store your files.
                </span>
              </div>

              {download && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  Your selected pages are ready to download.
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-red-100 bg-white p-7 shadow-[0_18px_50px_rgba(220,38,38,0.07)] xl:sticky xl:top-20 xl:self-start">
              <h2 className="text-xl font-extrabold text-slate-950">How it works</h2>
              <div className="mt-7 space-y-8">
                {howItWorksSteps.map((step, index) => {
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="relative">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                          <img src={step.icon} alt="" aria-hidden="true" className="h-14 w-14 object-contain drop-shadow-md" />
                        </span>
                        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-extrabold text-white">{index + 1}</span>
                      </div>
                      <div className="pt-1">
                        <h3 className="text-base font-extrabold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-9 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-5">
                <img src={splitSecureShieldIcon} alt="" aria-hidden="true" className="h-10 w-10 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-red-600">Safe & Private</strong>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">All processing happens in your browser. Your files never leave your device.</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <img src={splitPreviewPagesIcon} alt="" aria-hidden="true" className="h-10 w-10 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-slate-900">Tips</strong>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">Preview the pages before splitting to make sure you selected the right ones.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SplitPdfToolPage;
