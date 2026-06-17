import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import axios from '../Utils/axios';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiChevronRight,
  FiDownload,
  FiRefreshCw,
  FiUpload,
} from 'react-icons/fi';
import pdfIcon from '../assets/hero-icons/pdf-word.png';
import wordIcon from '../assets/hero-icons/word-pdf.png';
import editableOutputIcon from '../assets/converter-icons/editable-output.png';
import simpleWorkflowIcon from '../assets/converter-icons/simple-workflow.png';
import browserToolIcon from '../assets/converter-icons/browser-tool.png';
import privateFilesIcon from '../assets/converter-icons/private-files.png';
import uploadPdfIcon from '../assets/converter-icons/upload-pdf.png';
import convertDocumentIcon from '../assets/converter-icons/convert-document.png';
import downloadWordIcon from '../assets/converter-icons/download-word.png';
import ConversionLoadingOverlay from './ConversionLoadingOverlay';

const features = [
  {
    title: 'Editable output',
    description: 'Get a fully editable DOCX file that is easy to modify in Word.',
    icon: editableOutputIcon,
    color: 'bg-rose-50 text-rose-500',
  },
  {
    title: 'Simple workflow',
    description: 'Upload your PDF, we convert it, and you download.',
    icon: simpleWorkflowIcon,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Works in browser',
    description: 'No software installation needed. Works online.',
    icon: browserToolIcon,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Privacy-aware',
    description: 'Your files are safe and deleted automatically after conversion.',
    icon: privateFilesIcon,
    color: 'bg-blue-50 text-blue-600',
  },
];

const steps = [
  {
    title: 'Upload PDF',
    description: 'Choose or drag a PDF file into the upload area.',
    icon: uploadPdfIcon,
    color: 'bg-blue-50 text-blue-600',
    badge: 'bg-blue-600',
  },
  {
    title: 'We convert it',
    description: 'Our tool converts your PDF to DOCX format.',
    icon: convertDocumentIcon,
    color: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-500',
  },
  {
    title: 'Download Word',
    description: 'Download your editable Word file instantly.',
    icon: downloadWordIcon,
    color: 'bg-violet-50 text-violet-600',
    badge: 'bg-violet-600',
  },
];

const PdfConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isConverted, setIsConverted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const convertFile = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Please choose a PDF file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('The PDF must be 25 MB or smaller.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setIsConverted(false);
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await axios.post('/pdfconverter', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      setDownloadUrl(window.URL.createObjectURL(blob));
      setIsConverted(true);
    } catch (conversionError) {
      console.error('Error uploading file:', conversionError);
      setError('We could not convert this PDF. Please check the file and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      convertFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      convertFile(file);
    }
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setDownloadUrl('');
    setIsConverted(false);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="bg-[#fbf7ef]">
      <ConversionLoadingOverlay isVisible={isLoading} title="Converting PDF to Word" />
      <section className="relative overflow-hidden py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(254,243,199,0.5),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(231,229,228,0.55),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase text-red-600">PDF to Word</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Convert PDF to
                <span className="block text-blue-600">editable Word</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
                Upload a PDF and download a DOCX file that can be opened in Microsoft Word or compatible editors.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {['Accurate conversion', 'Keep original formatting', 'Secure & private'].map((label) => (
                  <span key={label} className="border-l-4 border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-[0_14px_34px_rgba(37,99,235,0.08)] sm:p-4">
              <div
                className={`flex min-h-[260px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition sm:min-h-[285px] sm:px-5 ${
                  isDragging ? 'border-blue-600 bg-blue-50' : 'border-blue-300 bg-white'
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
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />

                {isConverted ? (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                      <FiCheckCircle className="h-9 w-9" />
                    </span>
                    <h2 className="mt-4 text-xl font-extrabold text-slate-950">Your Word file is ready</h2>
                    <p className="mt-2 max-w-md truncate text-sm font-medium text-slate-500">
                      Converted from {selectedFile?.name}
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={downloadUrl}
                        download="converted.docx"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                      >
                        <FiDownload className="h-5 w-5" />
                        Download DOCX
                      </a>
                      <button
                        type="button"
                        onClick={handleStartOver}
                        className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Convert another
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <img src={pdfIcon} alt="" aria-hidden="true" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
                      <FiArrowRight className="h-7 w-7 text-blue-600 sm:h-8 sm:w-8" />
                      <img src={wordIcon} alt="" aria-hidden="true" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
                    </div>
                    <h2 className="mt-3 text-xl font-extrabold text-slate-950">
                      {isLoading ? 'Converting your PDF...' : selectedFile ? selectedFile.name : 'Drop your PDF here'}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {isLoading ? 'Please keep this page open.' : 'or choose a file to get started'}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {isLoading ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : <FiUpload className="h-5 w-5" />}
                      {isLoading ? 'Converting...' : 'Choose PDF file'}
                    </button>
                    <p className="mt-4 text-xs font-medium text-slate-500">Max file size: 25 MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-5 grid overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_10px_24px_rgba(37,99,235,0.05)] sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => {
              return (
                <div key={feature.title} className={`flex min-h-28 items-start gap-4 p-4 sm:items-center sm:p-5 ${index > 0 ? 'border-t border-blue-100 sm:border-l sm:border-t-0' : ''}`}>
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg sm:h-16 sm:w-16 ${feature.color}`}>
                    <img src={feature.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
                  </span>
                  <span>
                    <strong className="block text-base font-extrabold text-slate-950">{feature.title}</strong>
                    <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">{feature.description}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-[0.7fr_1.8fr] xl:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase text-blue-600">How it works</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Convert in 3 easy steps</h2>
              <p className="mt-4 max-w-md text-base font-medium leading-7 text-slate-600">
                A fast and secure way to turn your PDF into an editable Word document.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => {
                return (
                  <div key={step.title} className="relative">
                    <article className="flex min-h-36 items-start gap-4 rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(37,99,235,0.05)] sm:min-h-40 sm:items-center sm:gap-5 sm:p-6">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg sm:h-16 sm:w-16 ${step.color}`}>
                        <img src={step.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
                      </span>
                      <div>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white ${step.badge}`}>
                          {index + 1}
                        </span>
                        <h3 className="mt-3 text-base font-extrabold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.description}</p>
                      </div>
                    </article>
                    {index < steps.length - 1 && (
                      <span className="absolute -right-7 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 lg:flex">
                        <FiChevronRight className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PdfConverter;
