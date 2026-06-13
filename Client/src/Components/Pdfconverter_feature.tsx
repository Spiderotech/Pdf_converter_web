import { FiFileText, FiLock, FiMonitor, FiZap } from 'react-icons/fi';

const features = [
  {
    title: 'Editable output',
    description: 'Download a DOCX file that can be opened in Word or compatible document editors.',
    icon: FiFileText,
  },
  {
    title: 'Simple workflow',
    description: 'Upload the PDF, wait for processing, then download the converted document.',
    icon: FiZap,
  },
  {
    title: 'Works in browser',
    description: 'No desktop app is required. The conversion runs through the website workflow.',
    icon: FiMonitor,
  },
  {
    title: 'Privacy-aware',
    description: 'Files should be handled temporarily and used only for the selected conversion.',
    icon: FiLock,
  },
];

const Pdfconverter_feature = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">PDF conversion</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Built for clean PDF to Word conversion</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Keep the page focused on the task: choose a PDF, process it, and download the Word document.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-600">
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

export default Pdfconverter_feature;
