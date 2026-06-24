import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw,
  FiUpload,
} from 'react-icons/fi';
import axios from '../../Utils/axios';
import pptxPdfHeroIcon from '../../assets/converter-icons/pptx-pdf-hero.webp';
import pptxPdfSecurePrivateIcon from '../../assets/converter-icons/pptx-pdf-secure-private.webp';
import pptxPdfFastEasyIcon from '../../assets/converter-icons/pptx-pdf-fast-easy.webp';
import pptxPdfHighQualityIcon from '../../assets/converter-icons/pptx-pdf-high-quality.webp';
import pptxPdfUploadPptxIcon from '../../assets/converter-icons/pptx-pdf-upload-pptx.webp';
import pptxPdfConvertProcessIcon from '../../assets/converter-icons/pptx-pdf-convert-process.webp';
import pptxPdfDownloadPdfIcon from '../../assets/converter-icons/pptx-pdf-download-pdf.webp';
import pptxPdfPrivateLockIcon from '../../assets/converter-icons/pptx-pdf-private-lock.webp';
import pptxPdfProtectedFilesIcon from '../../assets/converter-icons/pptx-pdf-protected-files.webp';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';

const trustItems = [
  { title: 'Secure & Private', text: 'Your files are processed securely and never stored.', icon: pptxPdfSecurePrivateIcon },
  { title: 'Fast & Easy', text: 'Convert your presentation in just a few seconds.', icon: pptxPdfFastEasyIcon },
  { title: 'High Quality', text: 'Get a PDF that preserves your layout and formatting.', icon: pptxPdfHighQualityIcon },
];

const howItWorksSteps = [
  { title: 'Upload file', text: 'Choose or drag and drop your PowerPoint file.', icon: pptxPdfUploadPptxIcon },
  { title: 'Convert', text: 'We convert your PPTX presentation to PDF in seconds.', icon: pptxPdfConvertProcessIcon },
  { title: 'Download PDF', text: 'Download your PDF file and share it anywhere.', icon: pptxPdfDownloadPdfIcon },
];

const PptxPdfToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setPresentation = (selectedFile: File) => {
    const extension = selectedFile.name.toLowerCase().split('.').pop();
    if ((extension !== 'ppt' && extension !== 'pptx') || selectedFile.size > 25 * 1024 * 1024) {
      setError('Choose a PPT or PPTX file that is 25 MB or smaller.');
      return;
    }

    setFile(selectedFile);
    setDownloadUrl('');
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setPresentation(selectedFile);
    }
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      setPresentation(selectedFile);
    }
  };

  const convertPresentation = async () => {
    if (!file) {
      setError('Choose a PowerPoint file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsProcessing(true);
    setDownloadUrl('');
    setError('');

    try {
      const response = await axios.post('/pptxtopdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      setDownloadUrl(URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })));
    } catch (conversionError) {
      console.error(conversionError);
      setError('This presentation could not be converted. Check the file or backend converter setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Converting PPTX to PDF" />
      <main className="relative overflow-hidden bg-[#f8faff] py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_10%,rgba(219,234,254,0.75),transparent_26%),radial-gradient(circle_at_14%_75%,rgba(224,231,255,0.45),transparent_24%)]" />

        <section className="relative mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-extrabold uppercase text-blue-600">Presentation Conversion</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
                Convert <span className="text-blue-600">PPTX</span> to PDF
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                Convert PowerPoint presentations into high-quality PDF files for easy sharing, printing, and archiving.
              </p>

              <div className="mt-7 grid max-w-3xl gap-4 sm:grid-cols-3">
                {trustItems.map(({ title, text, icon }) => (
                  <div key={title} className="flex gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-sm" />
                    </span>
                    <span>
                      <strong className="block text-sm font-extrabold text-slate-950">{title}</strong>
                      <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <span className="absolute -inset-10 rounded-full bg-blue-100/70 blur-3xl" />
                <img src={pptxPdfHeroIcon} alt="" aria-hidden="true" className="relative h-56 w-full max-w-md object-contain drop-shadow-2xl sm:h-64" />
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div>
              <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-[0_14px_34px_rgba(37,99,235,0.06)] sm:p-5">
                <input ref={fileInputRef} type="file" accept=".ppt,.pptx" onChange={handleFileChange} className="hidden" />
                <div
                  className={`flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition sm:min-h-[360px] sm:px-6 sm:py-10 ${
                    isDragging ? 'border-blue-600 bg-blue-50' : 'border-blue-300'
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
                  <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-20 sm:w-20">
                    {isProcessing ? (
                      <FiRefreshCw className="h-8 w-8 animate-spin sm:h-10 sm:w-10" />
                    ) : (
                      <img src={pptxPdfUploadPptxIcon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-16 sm:w-16" />
                    )}
                  </span>
                  <h2 className="mt-5 max-w-full break-words text-xl font-extrabold text-slate-950 sm:text-2xl">
                    {isProcessing ? 'Converting your presentation...' : file ? file.name : 'Drag & drop your PowerPoint file here'}
                  </h2>
                  <p className="mt-3 text-sm font-medium text-slate-500">{isProcessing ? 'Please keep this page open.' : 'or'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="mt-4 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-300 sm:px-8"
                  >
                    <FiUpload className="h-5 w-5" />
                    {file ? 'Replace file' : 'Choose file'}
                  </button>
                  <p className="mt-5 text-sm font-medium text-slate-500">Supports PPT and PPTX files. Recommended maximum size: 25 MB.</p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-4 rounded-lg border border-blue-100 bg-blue-50/70 px-6 py-4">
                <img src={pptxPdfProtectedFilesIcon} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-slate-800">Only presentation files are processed.</strong>
                  <p className="mt-1 text-sm font-medium text-slate-600">Your files are automatically deleted after conversion is complete.</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={convertPresentation}
                  disabled={!file || isProcessing}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 text-base font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : null}
                  {isProcessing ? 'Converting...' : 'PPTX to PDF'}
                  {!isProcessing && <FiArrowRight className="h-5 w-5" />}
                </button>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download="presentation.pdf"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 text-sm font-extrabold text-white hover:bg-emerald-600"
                  >
                    <FiDownload className="h-5 w-5" />
                    Download PDF
                  </a>
                )}
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <img src={pptxPdfSecurePrivateIcon} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
                  We do not store or share your files.
                </span>
              </div>

              {downloadUrl && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  Your presentation PDF is ready to download.
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_14px_34px_rgba(37,99,235,0.06)] sm:p-7 xl:sticky xl:top-20 xl:self-start">
              <h2 className="text-xl font-extrabold text-slate-950">How it works</h2>
              <div className="relative mt-8 space-y-10 before:absolute before:bottom-8 before:left-8 before:top-8 before:border-l-2 before:border-dashed before:border-blue-100">
                {howItWorksSteps.map((step, index) => {
                  return (
                    <div key={step.title} className="relative flex gap-5">
                      <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:h-16 sm:w-16">
                        <img src={step.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
                        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">{index + 1}</span>
                      </span>
                      <div className="pt-1">
                        <h3 className="text-base font-extrabold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex items-start gap-3 rounded-lg bg-blue-50 p-5">
                <img src={pptxPdfPrivateLockIcon} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-blue-700">Your privacy matters</strong>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">We do not store or share your files. Your data remains protected.</p>
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

export default PptxPdfToolPage;
