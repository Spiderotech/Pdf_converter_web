import {
  FiChevronRight,
  FiLock,
  FiShield,
  FiTrash2,
} from 'react-icons/fi';
import chooseToolIcon from '../assets/section-icons/step-choose.png';
import uploadFileIcon from '../assets/section-icons/step-upload.png';
import downloadResultIcon from '../assets/section-icons/step-download.png';

const steps = [
  {
    title: 'Choose a tool',
    description: 'Select the document task you need, such as PDF to Word or Word to PDF.',
  },
  {
    title: 'Upload your file',
    description: 'Choose a supported file or drag it into the upload area on the tool page.',
  },
  {
    title: 'Download the result',
    description: 'The processed file is returned to your browser with a clear download action.',
  },
];

const illustrations = [
  { src: chooseToolIcon, alt: 'Document tool selection interface' },
  { src: uploadFileIcon, alt: 'Document file uploading' },
  { src: downloadResultIcon, alt: 'Completed document ready to download' },
];

const Howitwork = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-t border-stone-200 bg-[#f8f6f0] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(214,211,209,0.45),transparent_22%),radial-gradient(circle_at_88%_70%,rgba(254,243,199,0.55),transparent_24%)]" />

      <div className="relative mx-auto max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div>
          <p className="inline-flex rounded-full bg-stone-100 px-4 py-1.5 text-xs font-extrabold uppercase text-slate-700">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
            <span className="text-[#9a6514]">Three</span> simple steps
          </h2>
        </div>

        <div className="relative mt-8 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const illustration = illustrations[index];

            return (
              <div key={step.title} className="relative">
                <article className="grid min-h-[240px] gap-6 rounded-lg border border-stone-200 bg-white/90 p-6 shadow-[0_16px_35px_rgba(15,23,42,0.08)] sm:grid-cols-[minmax(0,1fr)_210px] sm:items-center lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_210px]">
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-base font-extrabold text-white shadow-lg shadow-slate-200">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-xl font-extrabold text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{step.description}</p>
                  </div>
                  <div className="flex h-[190px] items-center justify-center">
                    <img
                      src={illustration.src}
                      alt={illustration.alt}
                      className="h-full w-full object-contain drop-shadow-[0_18px_18px_rgba(15,23,42,0.14)]"
                    />
                  </div>
                </article>

                {index < steps.length - 1 && (
                  <span className="absolute -right-8 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#9a6514] shadow-lg shadow-slate-200 lg:flex">
                    <FiChevronRight className="h-7 w-7" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 rounded-lg border border-stone-200 bg-white px-6 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)] md:grid-cols-[1.6fr_repeat(3,1fr)] md:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-200">
              <FiShield className="h-7 w-7" />
            </span>
            <span>
              <strong className="block text-base font-extrabold text-slate-950">Your files are safe with us</strong>
              <span className="mt-1 block text-sm font-medium leading-6 text-slate-600">
                Files are encrypted and automatically deleted after processing.
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-slate-700">
              <FiLock className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold leading-6 text-slate-700">256-bit SSL<br />Encryption</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-slate-700">
              <FiTrash2 className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold leading-6 text-slate-700">Auto delete<br />After processing</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-slate-700">
              <FiShield className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold leading-6 text-slate-700">We never store<br />Your files</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howitwork;
