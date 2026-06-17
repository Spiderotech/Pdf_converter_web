import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiGrid,
  FiRefreshCw,
  FiUpload,
} from 'react-icons/fi';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';
import xlsxCsvHeroIcon from '../../assets/converter-icons/xlsx-csv-hero.png';
import xlsxUploadSpreadsheetIcon from '../../assets/converter-icons/xlsx-upload-spreadsheet.png';
import xlsxChooseSheetIcon from '../../assets/converter-icons/xlsx-choose-sheet.png';
import xlsxDownloadCsvIcon from '../../assets/converter-icons/xlsx-download-csv.png';
import xlsxSecurePrivateIcon from '../../assets/converter-icons/xlsx-secure-private.png';
import xlsxFastConversionIcon from '../../assets/converter-icons/xlsx-fast-conversion.png';
import xlsxHighAccuracyIcon from '../../assets/converter-icons/xlsx-high-accuracy.png';
import xlsxPrivateLockIcon from '../../assets/converter-icons/xlsx-private-lock.png';
import xlsxDataPrivacyIcon from '../../assets/converter-icons/xlsx-data-privacy.png';

type Workbook = import('xlsx').WorkBook;

const ALL_SHEETS = '__all__';

const trustItems = [
  { title: 'Secure & Private', text: 'Your files stay in this browser.', icon: xlsxSecurePrivateIcon },
  { title: 'Fast Conversion', text: 'Convert large Excel files in seconds.', icon: xlsxFastConversionIcon },
  { title: 'High Accuracy', text: 'Preserves your data and structure.', icon: xlsxHighAccuracyIcon },
];

const howItWorksSteps = [
  {
    title: 'Upload Excel file',
    text: 'Upload or drag and drop your XLS or XLSX file.',
    icon: xlsxUploadSpreadsheetIcon,
  },
  {
    title: 'Choose a sheet (optional)',
    text: 'Select the sheet you want to convert.',
    icon: xlsxChooseSheetIcon,
  },
  {
    title: 'Convert & download',
    text: 'We convert your data to CSV for instant download.',
    icon: xlsxDownloadCsvIcon,
  },
];

const XlsxCsvToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(ALL_SHEETS);
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const readWorkbook = async (selectedFile: File) => {
    const extension = selectedFile.name.toLowerCase().split('.').pop();
    if ((extension !== 'xls' && extension !== 'xlsx') || selectedFile.size > 25 * 1024 * 1024) {
      setError('Choose an XLS or XLSX file that is 25 MB or smaller.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setDownload(null);

    try {
      const XLSX = await import('xlsx');
      const parsedWorkbook = XLSX.read(await selectedFile.arrayBuffer(), { type: 'array' });
      if (parsedWorkbook.SheetNames.length === 0) {
        throw new Error('This workbook does not contain any sheets.');
      }

      setFile(selectedFile);
      setWorkbook(parsedWorkbook);
      setSheetNames(parsedWorkbook.SheetNames);
      setSelectedSheet(ALL_SHEETS);
    } catch (readError) {
      console.error(readError);
      setError('Could not read this spreadsheet. Please upload a valid XLS or XLSX file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      readWorkbook(selectedFile);
    }
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      readWorkbook(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!workbook) {
      setError('Choose a spreadsheet first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setDownload(null);

    try {
      const XLSX = await import('xlsx');
      let csv: string;
      let suffix: string;

      if (selectedSheet === ALL_SHEETS) {
        csv = sheetNames.map((sheetName) => {
          const sheetCsv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          return `"Sheet: ${sheetName.replace(/"/g, '""')}"\n${sheetCsv}`;
        }).join('\n\n');
        suffix = 'all-sheets';
      } else {
        csv = XLSX.utils.sheet_to_csv(workbook.Sheets[selectedSheet]);
        suffix = selectedSheet;
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const baseName = file?.name.replace(/\.[^.]+$/, '') || 'spreadsheet';
      setDownload({
        url: URL.createObjectURL(blob),
        name: `${baseName}-${suffix}.csv`,
      });
    } catch (conversionError) {
      console.error(conversionError);
      setError('Could not convert this workbook to CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Preparing your CSV file" />
      <main className="relative overflow-hidden bg-[#f8fcf9] py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(220,252,231,0.72),transparent_27%),radial-gradient(circle_at_15%_72%,rgba(219,234,254,0.4),transparent_24%)]" />

        <section className="relative mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm font-extrabold uppercase text-green-600">Spreadsheet Export</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
                Convert <span className="text-green-600">XLSX</span> to CSV
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                Upload an Excel workbook, choose a sheet, and download the data as a CSV file.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <span className="absolute -inset-6 rounded-full bg-green-100/70 blur-2xl" />
                <img
                  src={xlsxCsvHeroIcon}
                  alt=""
                  aria-hidden="true"
                  className="relative h-52 w-full max-w-[560px] object-contain drop-shadow-2xl sm:h-80"
                />
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div>
              <div className="rounded-lg border border-green-100 bg-white p-3 shadow-[0_14px_34px_rgba(22,163,74,0.06)] sm:p-5">
                <input ref={fileInputRef} type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" />
                <div
                  className={`flex min-h-[270px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition sm:min-h-[330px] sm:px-6 sm:py-10 ${
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
                  <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-50 text-green-600 sm:h-20 sm:w-20">
                    {isProcessing && !download ? (
                      <FiRefreshCw className="h-8 w-8 animate-spin sm:h-10 sm:w-10" />
                    ) : (
                      <img src={xlsxUploadSpreadsheetIcon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-16 sm:w-16" />
                    )}
                  </span>
                  <h2 className="mt-5 max-w-full break-words text-xl font-extrabold text-slate-950">
                    {file ? file.name : 'Drag & drop your Excel file here'}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500">{file ? `${sheetNames.length} sheet${sheetNames.length === 1 ? '' : 's'} detected` : 'or'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="mt-4 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-green-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-green-300 sm:px-8"
                  >
                    <FiUpload className="h-5 w-5" />
                    {file ? 'Replace Excel file' : 'Choose Excel file'}
                  </button>
                  <p className="mt-4 text-sm font-medium text-slate-500">Supports XLS and XLSX files. Maximum file size: 25 MB.</p>
                </div>

                <section className="mt-4 rounded-lg border border-slate-200 p-5">
                  <label htmlFor="sheet" className="text-sm font-extrabold text-slate-950">Select a sheet (optional)</label>
                  <div className="relative mt-3">
                    <FiGrid className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <select
                      id="sheet"
                      value={selectedSheet}
                      disabled={!workbook}
                      onChange={(event) => {
                        setSelectedSheet(event.target.value);
                        setDownload(null);
                      }}
                      className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-12 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-green-400 disabled:bg-slate-50"
                    >
                      <option value={ALL_SHEETS}>All sheets (default)</option>
                      {sheetNames.map((sheet) => <option key={sheet} value={sheet}>{sheet}</option>)}
                    </select>
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500">Leave as default to export all sheets or choose a specific sheet.</p>
                </section>

                <div className="mt-4 grid gap-px overflow-hidden rounded-lg bg-green-100 sm:grid-cols-3">
                  {trustItems.map(({ title, text, icon }) => (
                    <div key={title} className="flex items-center gap-4 bg-green-50/70 p-5">
                      <img src={icon} alt="" aria-hidden="true" className="h-11 w-11 shrink-0 object-contain drop-shadow-sm" />
                      <span>
                        <strong className="block text-xs font-extrabold text-slate-950">{title}</strong>
                        <span className="mt-1 block text-xs font-medium leading-5 text-slate-600">{text}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!workbook || isProcessing}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-green-600 px-8 text-base font-extrabold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : null}
                  {isProcessing ? 'Converting...' : 'Convert to CSV'}
                  {!isProcessing && <FiArrowRight className="h-5 w-5" />}
                </button>
                {download && (
                  <a
                    href={download.url}
                    download={download.name}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-extrabold text-white hover:bg-blue-700"
                  >
                    <FiDownload className="h-5 w-5" />
                    Download CSV
                  </a>
                )}
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <img src={xlsxPrivateLockIcon} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
                  Safe, secure and easy to use
                </span>
              </div>

              {download && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  Your CSV file is ready to download.
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-green-100 bg-white p-5 shadow-[0_14px_34px_rgba(22,163,74,0.06)] sm:p-7 xl:sticky xl:top-20 xl:self-start">
              <h2 className="text-xl font-extrabold text-slate-950">How it works</h2>
              <div className="relative mt-8 space-y-10 before:absolute before:bottom-8 before:left-8 before:top-8 before:border-l-2 before:border-dashed before:border-green-100">
                {howItWorksSteps.map((step, index) => {
                  return (
                    <div key={step.title} className="relative flex gap-5">
                      <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-green-50 sm:h-16 sm:w-16">
                        <img src={step.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
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

              <div className="mt-10 flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-5">
                <img src={xlsxDataPrivacyIcon} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 object-contain drop-shadow-sm" />
                <div>
                  <strong className="block text-sm font-extrabold text-green-700">Your data is private</strong>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">Files are processed locally in your browser and are never uploaded.</p>
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

export default XlsxCsvToolPage;
