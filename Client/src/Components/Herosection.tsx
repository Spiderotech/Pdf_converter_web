import { FiArrowRight, FiCheckCircle, FiLock, FiUploadCloud } from 'react-icons/fi';

const Herosection = () => {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            No signup required
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Free PDF and document tools for everyday work
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Convert, merge, split, sign, and prepare documents in a clean workspace built for speed and clarity.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#tools"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Choose a tool
              <FiArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/pdf-to-word"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Convert PDF to Word
            </a>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="h-4 w-4 text-green-600" />
              Public tools
            </div>
            <div className="flex items-center gap-2">
              <FiLock className="h-4 w-4 text-green-600" />
              Secure HTTPS ready
            </div>
            <div className="flex items-center gap-2">
              <FiUploadCloud className="h-4 w-4 text-green-600" />
              Temporary processing
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">Document workspace</p>
                <p className="mt-1 text-sm text-slate-500">Upload, process, download</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Ready
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ['PDF to Word', 'Convert PDF files into editable documents', 'PDF'],
                ['Merge PDF', 'Combine multiple files into one PDF', 'PDF'],
                ['XLSX to CSV', 'Export spreadsheet data quickly', 'XLSX'],
              ].map(([title, text, label]) => (
                <div key={title} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                  <span className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
