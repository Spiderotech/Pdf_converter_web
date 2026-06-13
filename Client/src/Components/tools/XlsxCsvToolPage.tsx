import { ChangeEvent, useRef, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiDownload, FiGrid, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';
import Footer from '../Footer';
import Header from '../Header';

type Workbook = import('xlsx').WorkBook;

const XlsxCsvToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    setIsProcessing(true);
    setError('');
    setDownload(null);

    try {
      const data = await selectedFile.arrayBuffer();
      const XLSX = await import('xlsx');
      const parsedWorkbook = XLSX.read(data, { type: 'array' });
      setFile(selectedFile);
      setWorkbook(parsedWorkbook);
      setSheetNames(parsedWorkbook.SheetNames);
      setSelectedSheet(parsedWorkbook.SheetNames[0] || '');
    } catch (readError) {
      console.error(readError);
      setError('Could not read this spreadsheet. Please upload a valid XLS or XLSX file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!workbook || !selectedSheet) {
      setError('Choose a spreadsheet first.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const XLSX = await import('xlsx');
      const sheet = workbook.Sheets[selectedSheet];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const baseName = file?.name.replace(/\.[^.]+$/, '') || 'spreadsheet';
      setDownload({
        url: URL.createObjectURL(blob),
        name: `${baseName}-${selectedSheet}.csv`,
      });
    } catch (conversionError) {
      console.error(conversionError);
      setError('Could not convert this sheet to CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Spreadsheet export</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Convert XLSX to CSV</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Upload an Excel workbook, choose a sheet, and download the data as a CSV file.
            </p>
          </div>

          <div className="mt-10 rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
            <input ref={fileInputRef} type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-green-50 text-green-600">
              {isProcessing ? <FiRefreshCw className="h-7 w-7 animate-spin" /> : <FiGrid className="h-7 w-7" />}
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-950">{file ? file.name : 'Choose an Excel file'}</h2>
            <p className="mt-2 text-sm text-slate-500">Supports XLS and XLSX files.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <FiUploadCloud className="h-4 w-4" />
              Choose file
            </button>
          </div>

          {sheetNames.length > 0 && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <label htmlFor="sheet" className="text-sm font-semibold text-slate-950">Sheet to export</label>
              <select
                id="sheet"
                value={selectedSheet}
                onChange={(event) => {
                  setSelectedSheet(event.target.value);
                  setDownload(null);
                }}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {sheetNames.map((sheet) => (
                  <option key={sheet} value={sheet}>{sheet}</option>
                ))}
              </select>
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleConvert}
              disabled={!workbook || isProcessing}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isProcessing ? 'Converting...' : 'Convert to CSV'}
            </button>
            {download && (
              <a
                href={download.url}
                download={download.name}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FiDownload className="h-4 w-4" />
                Download CSV
              </a>
            )}
          </div>

          {download && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-none" />
              <p>Your CSV file is ready.</p>
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 flex-none" />
              <p>{error}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default XlsxCsvToolPage;
