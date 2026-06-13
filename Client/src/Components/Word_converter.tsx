import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import axios from "../Utils/axios";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiFileText, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';

const WordConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isConverted, setIsConverted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const convertFile = async (file: File) => {
    setSelectedFile(file);
    setError('');
    setIsConverted(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await axios.post('/wordconverter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsConverted(true);
    } catch (conversionError) {
      console.error('Error uploading file:', conversionError);
      setError('We could not convert this Word document. Please check the file and try again.');
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
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
    <main className="bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Word to PDF</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Convert Word to PDF</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Upload a DOC or DOCX file and download a clean PDF for sharing, printing, or archiving.
          </p>
        </div>

        <div
          className={`mt-10 rounded-lg border-2 border-dashed bg-white p-6 text-center transition sm:p-10 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!isConverted && (
            <>
              <input
                type="file"
                accept=".doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {isLoading ? <FiRefreshCw className="h-6 w-6 animate-spin" /> : <FiUploadCloud className="h-6 w-6" />}
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                {isLoading ? 'Processing your document...' : selectedFile ? selectedFile.name : 'Choose a Word file'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Supports DOC and DOCX files. Recommended maximum size: 25 MB.
              </p>

              <button
                type="button"
                onClick={handleButtonClick}
                disabled={isLoading}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? 'Converting...' : 'Choose file'}
              </button>

              <p className="mt-3 text-sm text-slate-500">or drop your Word document here</p>
            </>
          )}

          {isConverted && (
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <FiCheckCircle className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">Your PDF is ready</h2>
              <p className="mt-2 text-sm text-slate-500">
                {selectedFile?.name ? `Converted from ${selectedFile.name}` : 'The file was converted successfully.'}
              </p>

              {downloadUrl && (
                <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <iframe
                    src={downloadUrl}
                    title="Converted PDF preview"
                    className="h-80 w-full"
                  />
                </div>
              )}

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={downloadUrl}
                  download="converted.pdf"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <FiDownload className="h-4 w-4" />
                  Download PDF
                </a>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 flex-none" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <FiFileText className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
          <p>Files are processed for conversion only. Do not upload documents you are not allowed to process.</p>
        </div>
      </section>
    </main>
  );
};

export default WordConverter;
