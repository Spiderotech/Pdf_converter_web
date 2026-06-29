import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import {
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiGrid,
  FiMenu,
  FiRefreshCw,
  FiTrash2,
} from 'react-icons/fi';
import ConversionFailureRecovery from '../ConversionFailureRecovery';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';
import mergeHeroPdfsIcon from '../../assets/converter-icons/merge-hero-pdfs.webp';
import mergePrivacyFolderIcon from '../../assets/converter-icons/merge-privacy-folder.webp';
import mergeUploadFilesIcon from '../../assets/converter-icons/merge-upload-files.webp';
import mergeReorderFilesIcon from '../../assets/converter-icons/merge-reorder-files.webp';
import mergeDownloadIcon from '../../assets/converter-icons/merge-download.webp';
import mergeEmptyFolderIcon from '../../assets/converter-icons/merge-empty-folder.webp';
import mergePrivateLockIcon from '../../assets/converter-icons/merge-private-lock.webp';
import mergeOfflineBoltIcon from '../../assets/converter-icons/merge-offline-bolt.webp';
import mergeSecureShieldIcon from '../../assets/converter-icons/merge-secure-shield.webp';

type PdfFileItem = {
  id: string;
  file: File;
};

const trustItems = [
  { title: '100% Private', text: 'Files never leave your device.', icon: mergePrivateLockIcon },
  { title: 'Works Offline', text: 'No internet connection needed.', icon: mergeOfflineBoltIcon },
  { title: 'Safe & Secure', text: 'We do not store your files.', icon: mergeSecureShieldIcon },
];

const howItWorksSteps = [
  {
    title: 'Add PDF files',
    text: 'Upload or drag and drop the PDF files you want to merge.',
    icon: mergeUploadFilesIcon,
    color: 'bg-blue-50',
  },
  {
    title: 'Reorder files',
    text: 'Arrange the files in your desired order using drag and drop.',
    icon: mergeReorderFilesIcon,
    color: 'bg-emerald-50',
  },
  {
    title: 'Merge & download',
    text: 'Click Merge PDF to combine and download your file.',
    icon: mergeDownloadIcon,
    color: 'bg-violet-50',
  },
];

const createDownload = (bytes: Uint8Array) => {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  return {
    url: URL.createObjectURL(blob),
    name: 'merged.pdf',
  };
};

const MergePdfToolPage = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const incoming = Array.from(fileList);
    const invalidFile = incoming.find((file) => (
      !(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
      || file.size > 25 * 1024 * 1024
    ));

    if (invalidFile) {
      setError('Choose PDF files that are 25 MB or smaller.');
      return;
    }

    const nextFiles = incoming.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
    }));

    setFiles((current) => [...current, ...nextFiles]);
    setDownload(null);
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const handleUploadDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFiles(false);
    addFiles(event.dataTransfer.files);
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDownload(null);
  };

  const reorderFiles = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      return;
    }

    setFiles((current) => {
      const next = [...current];
      const [dragged] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, dragged);
      return next;
    });
    setDraggedIndex(targetIndex);
    setDownload(null);
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
    setDownload(null);
  };

  const clearFiles = () => {
    setFiles([]);
    setDownload(null);
    setError('');
  };

  const mergeFiles = async () => {
    if (files.length < 2) {
      setError('Add at least two PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setDownload(null);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const sourcePdf = await PDFDocument.load(await item.file.arrayBuffer());
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setDownload(createDownload(await mergedPdf.save()));
    } catch (mergeError) {
      console.error(mergeError);
      setError('These PDF files could not be merged. Check that none of them are damaged or password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Merging your PDFs" />
      <main className="relative overflow-hidden bg-[#fbf7ef] py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(254,243,199,0.5),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(231,229,228,0.55),transparent_25%)]" />

        <section className="relative mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">
          <div className="relative text-center">
            <img decoding="async" loading="lazy"
              src={mergeHeroPdfsIcon}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 hidden h-36 w-44 object-contain opacity-95 drop-shadow-xl lg:block xl:left-16 xl:h-44 xl:w-56"
            />
            <img decoding="async" loading="lazy"
              src={mergePrivacyFolderIcon}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-3 hidden h-32 w-44 object-contain opacity-95 drop-shadow-xl lg:block xl:right-20 xl:h-40 xl:w-52"
            />
            <p className="text-sm font-extrabold uppercase text-red-600">PDF Merge</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-6xl">Merge PDF</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
              Combine multiple PDF files into one ordered document.
              <span className="block">Files are processed locally in your browser. Your privacy is always protected.</span>
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-[0_14px_34px_rgba(37,99,235,0.06)] sm:p-5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                className={`flex min-h-[260px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition sm:min-h-[310px] sm:px-6 sm:py-10 ${
                  isDraggingFiles ? 'border-blue-600 bg-blue-50' : 'border-blue-400 bg-white'
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDraggingFiles(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDraggingFiles(false);
                }}
                onDrop={handleUploadDrop}
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-blue-50 sm:h-24 sm:w-24">
                  <img decoding="async" loading="lazy" src={mergeUploadFilesIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20" />
                </span>
                <h2 className="mt-5 text-xl font-extrabold text-slate-950">Drag & drop your PDF files here</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 sm:px-8"
                >
                  <img decoding="async" loading="lazy" src={mergeUploadFilesIcon} alt="" aria-hidden="true" className="h-5 w-5 rounded-full object-contain" />
                  Choose PDF files
                </button>
                <p className="mt-4 text-sm font-medium text-slate-500">Supports PDF files. Maximum file size: 25 MB per file.</p>
              </div>

              <section className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                <div className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-200 px-5">
                  <h2 className="inline-flex items-center gap-3 text-sm font-extrabold text-slate-950">
                    <FiMenu className="h-5 w-5 text-slate-500" />
                    Files to merge ({files.length})
                  </h2>
                  <button
                    type="button"
                    onClick={clearFiles}
                    disabled={files.length === 0}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Clear all
                  </button>
                </div>

                {files.length === 0 ? (
                  <div className="flex min-h-40 flex-col items-center justify-center bg-white px-5 text-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-50">
                      <img decoding="async" loading="lazy" src={mergeEmptyFolderIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain drop-shadow-md" />
                    </span>
                    <strong className="mt-4 text-sm font-extrabold text-slate-600">No files added yet</strong>
                    <p className="mt-2 text-xs font-medium text-slate-500">Add PDF files using the upload area above.</p>
                  </div>
                ) : (
                  <div className="space-y-2 bg-slate-50 p-3">
                    {files.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(event) => {
                          event.preventDefault();
                          reorderFiles(index);
                        }}
                        onDragEnd={() => setDraggedIndex(null)}
                        className={`flex flex-col gap-3 rounded-lg border bg-white p-3 transition sm:flex-row sm:items-center ${
                          draggedIndex === index ? 'border-blue-400 shadow-md' : 'border-slate-200'
                        }`}
                      >
                        <FiGrid className="h-5 w-5 shrink-0 cursor-grab text-slate-400" />
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                          <FiFileText className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-sm font-bold text-slate-800">{item.file.name}</strong>
                          <span className="mt-1 block text-xs font-medium text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveFile(index, -1)}
                            disabled={index === 0}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30"
                            aria-label="Move file up"
                          >
                            <FiArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFile(index, 1)}
                            disabled={index === files.length - 1}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30"
                            aria-label="Move file down"
                          >
                            <FiArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(item.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Remove file"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="mt-5 grid gap-3 rounded-lg bg-blue-50/70 px-5 py-4 sm:grid-cols-3">
                {trustItems.map(({ title, text, icon }) => (
                  <div key={title} className="flex items-center gap-3">
                    <img decoding="async" loading="lazy" src={icon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain drop-shadow-sm" />
                    <span>
                      <strong className="block text-xs font-extrabold text-slate-900">{title}</strong>
                      <span className="mt-1 block text-xs font-medium text-slate-500">{text}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={mergeFiles}
                  disabled={files.length < 2 || isProcessing}
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-blue-600 px-7 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : <FiArrowRight className="h-5 w-5" />}
                  {isProcessing ? 'Merging...' : 'Merge PDF'}
                </button>
                {download && (
                  <a
                    href={download.url}
                    download={download.name}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-7 text-sm font-extrabold text-white hover:bg-emerald-600"
                  >
                    <FiDownload className="h-5 w-5" />
                    Download merged PDF
                  </a>
                )}
              </div>

              {download && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  Your merged PDF is ready to download.
                </div>
              )}

              {error && (
                <ConversionFailureRecovery
                  message={error}
                  onRetry={files.length >= 2 ? mergeFiles : undefined}
                  onChooseAnother={() => fileInputRef.current?.click()}
                  alternatives={[
                    { label: 'Try Split PDF', href: '/tools/split-pdf' },
                    { label: 'Compress PDF first', href: '/tools/compress-pdf' },
                    { label: 'Browse all tools', href: '/tools' },
                  ]}
                />
              )}
            </div>

            <aside className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_14px_34px_rgba(37,99,235,0.06)] sm:p-7 xl:sticky xl:top-20 xl:self-start">
              <h2 className="text-xl font-extrabold text-slate-950">How it works</h2>
              <div className="mt-7 space-y-8">
                {howItWorksSteps.map((step, index) => {
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="relative">
                        <span className={`flex h-14 w-14 items-center justify-center rounded-lg sm:h-16 sm:w-16 ${step.color}`}>
                          <img decoding="async" loading="lazy" src={step.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
                        </span>
                        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div className="pt-1">
                        <h3 className="text-base font-extrabold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex items-start gap-3 rounded-lg bg-blue-50 p-5">
                <img decoding="async" loading="lazy" src={mergeSecureShieldIcon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-blue-700">Your files stay private</strong>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">All merging happens in your browser. We never upload your files.</p>
                </div>
              </div>

              <div className="mt-10 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 xl:mt-24">
                <img decoding="async" loading="lazy" src={mergeReorderFilesIcon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0 object-contain drop-shadow-sm" />
                <p className="text-sm font-medium leading-6 text-slate-600">
                  <strong className="text-slate-900">Tip:</strong> You can reorder files by dragging them in the list.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MergePdfToolPage;
