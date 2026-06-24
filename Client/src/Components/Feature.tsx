import fastIcon from '../assets/section-icons/feature-fast.webp';
import globeIcon from '../assets/section-icons/feature-globe.webp';
import securityIcon from '../assets/section-icons/feature-security.webp';
import expandIcon from '../assets/section-icons/feature-expand.webp';

const features = [
  {
    title: 'Fast Workflows',
    description: 'Tool pages focus on the upload, processing, and download flow without unnecessary steps.',
    icon: fastIcon,
    iconClass: 'border-stone-200 bg-stone-50 text-slate-700 shadow-stone-100',
    numberClass: 'text-stone-200',
    accentClass: 'bg-slate-800',
    glowClass: 'bg-stone-100/70',
  },
  {
    title: 'No Signup for Launch',
    description: 'Public tools reduce friction and make conversions easier for first-time visitors.',
    icon: globeIcon,
    iconClass: 'border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100',
    numberClass: 'text-amber-200',
    accentClass: 'bg-[#b7791f]',
    glowClass: 'bg-amber-100/70',
  },
  {
    title: 'Clear File Handling',
    description: 'The interface explains supported formats, size limits, and temporary processing.',
    icon: securityIcon,
    iconClass: 'border-emerald-200 bg-emerald-50 text-emerald-600 shadow-emerald-100',
    numberClass: 'text-emerald-200',
    accentClass: 'bg-emerald-500',
    glowClass: 'bg-emerald-100/70',
  },
  {
    title: 'Built to Expand',
    description: 'The homepage is ready for more PDF, spreadsheet, and presentation tools as they are added.',
    icon: expandIcon,
    iconClass: 'border-violet-200 bg-violet-50 text-violet-600 shadow-violet-100',
    numberClass: 'text-violet-200',
    accentClass: 'bg-violet-500',
    glowClass: 'bg-violet-100/70',
  },
];

const Feature = () => {
  return (
    <section className="relative overflow-hidden border-t border-stone-200 bg-[#f7f5ef] py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(231,229,228,0.55),transparent_28%)]" />

      <div className="relative mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="inline-flex border-l-4 border-[#b7791f] bg-stone-100 px-3 py-1.5 text-xs font-extrabold uppercase text-slate-700">
            Why use it
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            A smarter, cleaner way
            <span className="block text-[#9a6514]">to handle document tasks</span>
          </h2>
          <p className="mt-4 text-base font-medium leading-7 text-slate-600 sm:text-lg">
            Built for speed, privacy, and simplicity.
            <span className="block">Everything you need. Nothing you don&apos;t.</span>
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            return (
              <article
                key={feature.title}
                className="relative min-h-[260px] overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] sm:min-h-[286px] sm:p-6"
              >
                <div className={`absolute -bottom-16 -right-14 h-52 w-52 rounded-full blur-2xl ${feature.glowClass}`} />
                <div className="relative flex items-start justify-between">
                  <span className={`flex h-16 w-16 items-center justify-center rounded-lg border shadow-sm sm:h-20 sm:w-20 ${feature.iconClass}`}>
                    <img
                      src={feature.icon}
                      alt=""
                      aria-hidden="true"
                      className="h-14 w-14 object-contain drop-shadow-lg sm:h-[4.5rem] sm:w-[4.5rem]"
                    />
                  </span>
                  <span className={`text-3xl font-black ${feature.numberClass}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="relative mt-7">
                  <h3 className="text-lg font-extrabold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{feature.description}</p>
                  <span className={`mt-5 block h-1 w-16 rounded-full ${feature.accentClass}`} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature;
