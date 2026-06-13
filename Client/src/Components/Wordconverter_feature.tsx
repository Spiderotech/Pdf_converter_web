import { FiDownload, FiFileText, FiLock, FiMonitor } from 'react-icons/fi';

const features = [
  {
    title: 'Shareable PDFs',
    description: 'Create PDF files that are easier to send, print, and archive.',
    icon: FiFileText,
  },
  {
    title: 'DOC and DOCX support',
    description: 'Upload common Microsoft Word document formats from your device.',
    icon: FiMonitor,
  },
  {
    title: 'Preview before saving',
    description: 'View the generated PDF in the browser before downloading it.',
    icon: FiDownload,
  },
  {
    title: 'Clear file handling',
    description: 'The conversion flow is designed for temporary document processing.',
    icon: FiLock,
  },
];

const Wordconverter_feature = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Word conversion</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Create PDFs from Word documents</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Turn DOC and DOCX files into PDFs with a direct upload and download workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Wordconverter_feature;
