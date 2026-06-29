import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { FiCheckCircle, FiDownload, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';
import axios from '../../Utils/axios';
import ConversionFailureRecovery from '../ConversionFailureRecovery';
import Footer from '../Footer';
import Header from '../Header';

type ServerPdfToolPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  endpoint: string;
  accept: string;
  outputName: string;
  icon: IconType;
  needsPassword?: boolean;
  passwordLabel?: string;
  qualityOptions?: Array<{ label: string; value: string }>;
};

const ServerPdfToolPage = ({
  title,
  eyebrow,
  description,
  endpoint,
  accept,
  outputName,
  icon: Icon,
  needsPassword = false,
  passwordLabel = 'Password',
  qualityOptions,
}: ServerPdfToolPageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [quality, setQuality] = useState(qualityOptions?.[0]?.value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportedFormats = accept
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.startsWith('.'))
    .map((item) => item.replace('.', '').toUpperCase())
    .join(', ');

  const setFile = (file: File) => {
    setSelectedFile(file);
    setDownloadUrl('');
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('Choose a file first.');
      return;
    }

    if (needsPassword && !password.trim()) {
      setError('Enter the PDF password first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (needsPassword) {
      formData.append('password', password);
    }
    if (qualityOptions && quality) {
      formData.append('quality', quality);
    }

    setIsProcessing(true);
    setError('');
    setDownloadUrl('');

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (processError) {
      console.error(processError);
      setError('This file could not be processed. Check the file, password, or backend tool setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
          </div>

          <div
            className={`mt-8 rounded-lg border-2 border-dashed bg-white p-4 text-center transition sm:mt-10 sm:p-10 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {isProcessing ? <FiRefreshCw className="h-7 w-7 animate-spin" /> : <Icon className="h-7 w-7" />}
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-950">{selectedFile ? selectedFile.name : 'Choose a file'}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Supports {supportedFormats || 'selected'} files. Recommended maximum size: 25 MB.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <FiUploadCloud className="h-4 w-4" />
              Choose file
            </button>
            <p className="mt-3 text-sm text-slate-500">or drop your file here</p>
          </div>

          {needsPassword && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <label htmlFor="toolPassword" className="text-sm font-semibold text-slate-950">{passwordLabel}</label>
              <input
                id="toolPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-slate-500">Passwords are sent only for this processing request.</p>
            </section>
          )}

          {qualityOptions && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <label htmlFor="toolQuality" className="text-sm font-semibold text-slate-950">Compression quality</label>
              <select
                id="toolQuality"
                value={quality}
                onChange={(event) => setQuality(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {qualityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="mt-2 text-sm text-slate-500">Lower quality usually creates a smaller PDF.</p>
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleProcess}
              disabled={isProcessing || !selectedFile}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isProcessing && <FiRefreshCw className="h-4 w-4 animate-spin" />}
              {isProcessing ? 'Processing...' : title}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={outputName}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FiDownload className="h-4 w-4" />
                Download PDF
              </a>
            )}
          </div>

          {downloadUrl && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-none" />
              <p>Your file is ready.</p>
            </div>
          )}

          {error && (
            <ConversionFailureRecovery
              message={error}
              onRetry={selectedFile ? handleProcess : undefined}
              onChooseAnother={() => fileInputRef.current?.click()}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ServerPdfToolPage;
