import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArchive,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw,
  FiUpload,
} from 'react-icons/fi';
import axios from '../../Utils/axios';
import compressPdfBetterSharingIcon from '../../assets/converter-icons/compress-pdf-better-sharing.png';
import compressPdfHeroIcon from '../../assets/converter-icons/compress-pdf-hero.png';
import compressPdfPrivateLockIcon from '../../assets/converter-icons/compress-pdf-private-lock.png';
import compressPdfQualityIcon from '../../assets/converter-icons/compress-pdf-quality.png';
import compressPdfSecurePrivateIcon from '../../assets/converter-icons/compress-pdf-secure-private.png';
import compressPdfSmallerSizeIcon from '../../assets/converter-icons/compress-pdf-smaller-size.png';
import compressPdfUploadIcon from '../../assets/converter-icons/compress-pdf-upload.png';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';

type CompressionQuality = 'printer' | 'ebook' | 'screen';

const qualityOptions: Array<{
  value: CompressionQuality;
  title: string;
  badge: string;
  description: string;
  sizeLabel: string;
  activeBars: number;
}> = [
  {
    value: 'printer',
    title: 'Low compression',
    badge: 'Best quality',
    description: 'Minimal reduction in file size.',
    sizeLabel: 'Larger file size',
    activeBars: 3,
  },
  {
    value: 'ebook',
    title: 'Medium compression',
    badge: 'Recommended',
    description: 'Good balance between size and quality.',
    sizeLabel: 'Medium file size',
    activeBars: 2,
  },
  {
    value: 'screen',
    title: 'High compression',
    badge: '',
    description: 'Maximum reduction in file size.',
    sizeLabel: 'Smaller file size',
    activeBars: 1,
  },
];

const featureCards = [
  { title: 'Smaller File Size', text: 'Reduce file size while maintaining good quality.', icon: compressPdfSmallerSizeIcon },
  { title: 'Secure & Private', text: 'Your files are processed securely and deleted automatically.', icon: compressPdfSecurePrivateIcon },
  { title: 'Better Sharing', text: 'Easier to upload, share, and store.', icon: compressPdfBetterSharingIcon },
];

const CompressPdfToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<CompressionQuality>('printer');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const selectFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a valid PDF file.');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('Choose a PDF file that is 25 MB or smaller.');
      return;
    }

    setFile(selectedFile);
    setDownloadUrl('');
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      selectFile(selectedFile);
    }
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  const compressPdf = async () => {
    if (!file) {
      setError('Choose a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    setIsProcessing(true);
    setDownloadUrl('');
    setError('');

    try {
      const response = await axios.post('/compresspdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      setDownloadUrl(URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })));
    } catch (compressionError) {
      console.error(compressionError);
      setError('This PDF could not be compressed. Check the file or backend compression setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Compressing your PDF" />
      <main className="relative overflow-hidden bg-[#fbf7ef] py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(254,243,199,0.5),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(231,229,228,0.55),transparent_25%)]" />

        <section className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <header className="text-center">
            <p className="inline-flex items-center gap-3 text-sm font-extrabold uppercase text-blue-600 sm:text-base">
              <img src={compressPdfHeroIcon} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
              PDF Compression
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 sm:text-6xl">Compress PDF</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
              Reduce PDF file size using backend compression. Best results are usually on scanned or image-heavy PDFs.
            </p>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {featureCards.map(({ title, text, icon }) => (
              <div
                key={title}
                className="flex min-h-28 items-start gap-4 rounded-lg border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(30,64,175,0.06)]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
                </span>
                <span>
                  <strong className="block text-sm font-extrabold text-slate-950">{title}</strong>
                  <span className="mt-2 block text-xs font-medium leading-5 text-slate-600">{text}</span>
                </span>
              </div>
            ))}
          </div>

          <div
            className={`mt-10 flex min-h-[430px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white px-6 py-12 text-center shadow-[0_18px_55px_rgba(37,99,235,0.06)] transition ${
              isDragging ? 'border-blue-700 bg-blue-50' : 'border-blue-500'
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

            <img src={compressPdfUploadIcon} alt="" aria-hidden="true" className="h-32 w-32 object-contain sm:h-36 sm:w-36" />

            <h2 className="mt-7 max-w-full break-words text-xl font-extrabold text-slate-950 sm:text-2xl">
              {isProcessing ? 'Compressing your PDF...' : file ? file.name : 'Drag & drop your PDF file here'}
            </h2>
            <div className="mt-4 flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="h-px w-10 bg-slate-300" />
              {isProcessing ? 'Please keep this page open' : 'or'}
              <span className="h-px w-10 bg-slate-300" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="mt-5 inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 px-10 text-base font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              <FiUpload className="h-5 w-5" />
              {file ? 'Replace file' : 'Choose file'}
            </button>
            <p className="mt-5 text-sm font-medium leading-6 text-slate-500">
              Recommended maximum size: 25 MB.
              <br />
              Supports PDF files.
            </p>
          </div>

          <section className="mt-8 rounded-lg border border-blue-100 bg-white p-5 shadow-[0_15px_40px_rgba(30,64,175,0.06)] sm:p-7">
            <h2 className="text-xl font-extrabold text-slate-950">Compression quality</h2>
            <p className="mt-2 text-sm font-medium text-slate-600">Choose the right balance between file size and quality.</p>

            <div className="mt-5 space-y-3">
              {qualityOptions.map((option) => {
                const selected = quality === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setQuality(option.value)}
                    className={`grid w-full gap-4 rounded-lg border p-5 text-left transition sm:grid-cols-[1fr_auto] sm:items-center ${
                      selected ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-blue-300'
                    }`}
                    aria-pressed={selected}
                  >
                    <span className="flex items-start gap-4">
                      <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? 'border-blue-600' : 'border-slate-400'
                      }`}>
                        {selected && <span className="h-3 w-3 rounded-full bg-blue-600" />}
                      </span>
                      <span>
                        <span className="flex flex-wrap items-center gap-2">
                          <strong className="text-base font-extrabold text-slate-950">{option.title}</strong>
                          {option.badge && (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-600">{option.badge}</span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm font-medium text-slate-600">{option.description}</span>
                      </span>
                    </span>
                    <span className="flex items-center gap-5 pl-9 text-xs font-medium text-slate-600 sm:pl-0">
                      {option.sizeLabel}
                      <span className="flex gap-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <span key={bar} className={`h-1.5 w-4 rounded-full ${bar <= option.activeBars ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        ))}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-lg bg-blue-50 px-5 py-4 text-sm font-medium text-slate-700">
              <img src={compressPdfQualityIcon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0 object-contain" />
              <p><span className="font-extrabold text-blue-600">Higher compression</span> may reduce image quality in some PDFs.</p>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={compressPdf}
              disabled={!file || isProcessing}
              className="inline-flex h-16 items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 text-lg font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : <FiArchive className="h-5 w-5" />}
              {isProcessing ? 'Compressing...' : 'Compress PDF'}
              {!isProcessing && <FiArrowRight className="h-5 w-5" />}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="compressed.pdf"
                className="inline-flex h-16 items-center justify-center gap-3 rounded-lg bg-green-600 px-8 text-base font-extrabold text-white hover:bg-green-700"
              >
                <FiDownload className="h-5 w-5" />
                Download compressed PDF
              </a>
            )}

            <span className="inline-flex items-center gap-3 text-sm font-medium leading-6 text-slate-600">
              <img src={compressPdfPrivateLockIcon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
              Your files are processed securely and deleted automatically.
            </span>
          </div>

          {downloadUrl && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
              Your compressed PDF is ready to download.
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {error}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CompressPdfToolPage;
