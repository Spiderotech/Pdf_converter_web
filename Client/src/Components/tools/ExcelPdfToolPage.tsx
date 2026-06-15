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
import excelPdfHeroIcon from '../../assets/converter-icons/excel-pdf-hero.png';
import excelPdfSecurePrivateIcon from '../../assets/converter-icons/excel-pdf-secure-private.png';
import excelPdfFastConversionIcon from '../../assets/converter-icons/excel-pdf-fast-conversion.png';
import excelPdfHighQualityIcon from '../../assets/converter-icons/excel-pdf-high-quality.png';
import excelPdfUploadExcelIcon from '../../assets/converter-icons/excel-pdf-upload-excel.png';
import excelPdfConvertProcessIcon from '../../assets/converter-icons/excel-pdf-convert-process.png';
import excelPdfDownloadPdfIcon from '../../assets/converter-icons/excel-pdf-download-pdf.png';
import excelPdfPrivateLockIcon from '../../assets/converter-icons/excel-pdf-private-lock.png';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';

const trustItems = [
  { title: 'Secure & Private', text: 'Your files are protected and automatically deleted.', icon: excelPdfSecurePrivateIcon },
  { title: 'Fast Conversion', text: 'Convert your Excel files in seconds.', icon: excelPdfFastConversionIcon },
  { title: 'High Quality', text: 'Preserves layout, formatting, and visual clarity.', icon: excelPdfHighQualityIcon },
];

const howItWorksSteps = [
  { title: 'Upload Excel file', text: 'Choose or drag and drop your Excel workbook.', icon: excelPdfUploadExcelIcon },
  { title: 'Convert', text: 'We process your file and convert it to PDF.', icon: excelPdfConvertProcessIcon },
  { title: 'Download PDF', text: 'Download your PDF file and use it anywhere.', icon: excelPdfDownloadPdfIcon },
];

const ExcelPdfToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setWorkbook = (selectedFile: File) => {
    const extension = selectedFile.name.toLowerCase().split('.').pop();
    if ((extension !== 'xls' && extension !== 'xlsx') || selectedFile.size > 25 * 1024 * 1024) {
      setError('Choose an XLS or XLSX file that is 25 MB or smaller.');
      return;
    }

    setFile(selectedFile);
    setDownloadUrl('');
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setWorkbook(selectedFile);
    }
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      setWorkbook(selectedFile);
    }
  };

  const convertWorkbook = async () => {
    if (!file) {
      setError('Choose an Excel workbook first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsProcessing(true);
    setDownloadUrl('');
    setError('');

    try {
      const response = await axios.post('/exceltopdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      setDownloadUrl(URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })));
    } catch (conversionError) {
      console.error(conversionError);
      setError('This workbook could not be converted. Check the file or backend converter setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Converting Excel to PDF" />
      <main className="relative overflow-hidden bg-[#f8fcf9] py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(220,252,231,0.65),transparent_25%),radial-gradient(circle_at_85%_72%,rgba(219,234,254,0.38),transparent_24%)]" />

        <section className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase text-green-600">
              Spreadsheet Conversion
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
              Excel <span className="text-green-600">to PDF</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
              Convert Excel workbooks into PDF files while preserving readable table layout, formatting, and charts.
            </p>

            <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-3">
              {trustItems.map(({ title, text, icon }) => (
                <div key={title} className="flex items-center gap-4 rounded-lg border border-green-100 bg-white p-4 text-left shadow-[0_10px_25px_rgba(22,163,74,0.05)]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <img src={icon} alt="" aria-hidden="true" className="h-10 w-10 object-contain drop-shadow-sm" />
                  </span>
                  <span>
                    <strong className="block text-sm font-extrabold text-slate-950">{title}</strong>
                    <span className="mt-1 block text-xs font-medium leading-5 text-slate-600">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div
                className={`flex min-h-[380px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white px-6 py-10 text-center shadow-[0_18px_50px_rgba(22,163,74,0.06)] transition ${
                  isDragging ? 'border-green-600 bg-green-50' : 'border-green-400'
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
                <input ref={fileInputRef} type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" />

                <div className="relative">
                  <span className="absolute -inset-5 rounded-full bg-green-100/70 blur-2xl" />
                  <img src={excelPdfHeroIcon} alt="" aria-hidden="true" className="relative h-44 w-full max-w-md object-contain drop-shadow-2xl" />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                  {isProcessing ? 'Converting your workbook...' : file ? file.name : 'Drag & drop your Excel file here'}
                </h2>
                <p className="mt-3 text-sm font-medium text-slate-500">{isProcessing ? 'Please keep this page open.' : 'or'}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-green-600 px-9 text-sm font-extrabold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-green-300"
                >
                  <FiUpload className="h-5 w-5" />
                  {file ? 'Replace file' : 'Choose file'}
                </button>
                <p className="mt-5 text-sm font-medium text-slate-500">Supports XLS and XLSX files. Recommended maximum size: 25 MB.</p>
              </div>

              <div className="mt-5 flex items-start gap-4 rounded-lg border border-green-100 bg-green-50/70 px-6 py-4">
                <img src={excelPdfPrivateLockIcon} alt="" aria-hidden="true" className="h-11 w-11 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-slate-900">Your privacy matters</strong>
                  <p className="mt-1 text-sm font-medium text-slate-600">We do not store or share your files. Your data remains protected.</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={convertWorkbook}
                  disabled={!file || isProcessing}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-green-600 px-8 text-base font-extrabold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : null}
                  {isProcessing ? 'Converting...' : 'Excel to PDF'}
                  {!isProcessing && <FiArrowRight className="h-5 w-5" />}
                </button>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download="spreadsheet.pdf"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-extrabold text-white hover:bg-blue-700"
                  >
                    <FiDownload className="h-5 w-5" />
                    Download PDF
                  </a>
                )}
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <img src={excelPdfSecurePrivateIcon} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
                  We do not store or share your files.
                </span>
              </div>

              {downloadUrl && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  Your spreadsheet PDF is ready to download.
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-green-100 bg-white p-7 shadow-[0_18px_50px_rgba(22,163,74,0.07)] xl:sticky xl:top-20 xl:self-start">
              <h2 className="text-xl font-extrabold text-slate-950">How it works</h2>
              <div className="relative mt-8 space-y-10 before:absolute before:bottom-8 before:left-8 before:top-8 before:border-l-2 before:border-green-100">
                {howItWorksSteps.map((step, index) => {
                  return (
                    <div key={step.title} className="relative flex gap-5">
                      <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-50">
                        <img src={step.icon} alt="" aria-hidden="true" className="h-14 w-14 object-contain drop-shadow-md" />
                        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-extrabold text-white">{index + 1}</span>
                      </span>
                      <div className="pt-1">
                        <h3 className="text-base font-extrabold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ExcelPdfToolPage;
