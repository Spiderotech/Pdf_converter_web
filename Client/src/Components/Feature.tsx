import { FiClock, FiGlobe, FiLock, FiSliders } from 'react-icons/fi';

const features = [
  {
    title: 'Fast workflows',
    description: 'Tool pages focus on the upload, processing, and download flow without unnecessary steps.',
    icon: FiClock,
  },
  {
    title: 'No signup for launch',
    description: 'Public tools reduce friction and make conversions easier for first-time visitors.',
    icon: FiGlobe,
  },
  {
    title: 'Clear file handling',
    description: 'The interface explains supported formats, size limits, and temporary processing.',
    icon: FiLock,
  },
  {
    title: 'Built to expand',
    description: 'The homepage is ready for more PDF, spreadsheet, and presentation tools as they are added.',
    icon: FiSliders,
  },
];

const Feature = () => {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Why use it</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">A cleaner way to handle document tasks</h2>
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

export default Feature;
