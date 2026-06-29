import {
  FiArrowRight,
} from 'react-icons/fi';
import heroToolsImage from '../assets/filebrother-hero-tools-professional.webp';
import professionalSecureIcon from '../assets/hero-icons/professional/secure.webp';
import professionalToolsIcon from '../assets/hero-icons/professional/tools.webp';
import professionalUsersIcon from '../assets/hero-icons/professional/users.webp';
import professionalClockIcon from '../assets/hero-icons/professional/clock.webp';
import professionalRatingIcon from '../assets/hero-icons/professional/rating.webp';
import mergePdfIcon from '../assets/hero-icons/merge-pdf.webp';
import splitPdfIcon from '../assets/hero-icons/split-pdf.webp';
import compressPdfIcon from '../assets/hero-icons/compress-pdf.webp';
import pdfWordIcon from '../assets/hero-icons/pdf-word.webp';
import wordPdfIcon from '../assets/hero-icons/word-pdf.webp';
import xlsxCsvIcon from '../assets/hero-icons/xlsx-csv.webp';
import signPdfIcon from '../assets/hero-icons/sign-pdf.webp';
import lockPdfIcon from '../assets/hero-icons/lock-pdf.webp';

const HeroIconImage = ({ src, className }: { src: string; className: string }) => (
  <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" className={`${className} object-contain`} />
);



const stats = [
  { value: '5M+', label: 'Happy Users', icon: professionalUsersIcon },
  { value: '99.9%', label: 'Secure Processing', icon: professionalSecureIcon },
  { value: '8 Sec', label: 'Avg. Conversion', icon: professionalClockIcon },
  { value: '4.8/5', label: 'User Rating', icon: professionalRatingIcon },
];

const popularTools = [
  { title: 'Merge PDF', icon: mergePdfIcon, href: '/tools/merge-pdf' },
  { title: 'Split PDF', icon: splitPdfIcon, href: '/tools/split-pdf' },
  { title: 'Compress PDF', icon: compressPdfIcon, href: '/tools/compress-pdf' },
  { title: 'PDF to Word', icon: pdfWordIcon, href: '/tools/pdf-to-word' },
  { title: 'Word to PDF', icon: wordPdfIcon, href: '/tools/word-to-pdf' },
  { title: 'XLSX to CSV', icon: xlsxCsvIcon, href: '/tools/xlsx-to-csv' },
  { title: 'Sign PDF', icon: signPdfIcon, href: '/tools/sign-pdf' },
  { title: 'Lock PDF', icon: lockPdfIcon, href: '/tools/protect-pdf' },
];

const trustItems = [
  { label: 'Private processing', icon: professionalSecureIcon },
  { label: 'No sign up', icon: professionalUsersIcon },
  { label: 'Works in browser', icon: professionalToolsIcon },
];

const Herosection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f8f6f0] lg:min-h-[calc(100svh-4.5rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(214,211,209,0.45),transparent_22%),radial-gradient(circle_at_88%_70%,rgba(254,243,199,0.55),transparent_24%)]" />
      <div className="relative mx-auto flex max-w-[1720px] flex-col justify-center px-4 py-8 sm:px-8 sm:py-10 lg:min-h-[calc(100svh-4.5rem)] lg:px-10 lg:py-4">
        <div className="grid items-center gap-7 lg:grid-cols-[0.88fr_1.12fr] lg:gap-3">
          <div className="relative">
            <div className="absolute -left-8 -top-8 hidden h-28 w-28 rounded-full bg-amber-200/35 blur-3xl lg:block" />
            <div className="relative">
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-[3.35rem] xl:text-[3.65rem]">
                All your PDF tasks,
                <span className="block">done in <span className="bg-gradient-to-r from-[#7c4f12] to-[#c0841a] bg-clip-text text-transparent">one place.</span></span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-extrabold leading-6 text-slate-500 xl:text-base xl:leading-7">
                Convert, compress, edit, sign and secure documents with a polished workflow built for fast everyday work.
              </p>
              <div className="mt-4 grid gap-3 text-xs font-extrabold text-slate-600 sm:grid-cols-3 xl:text-sm">
                {trustItems.map(({ label, icon }) => (
                  <span key={label} className="inline-flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 ring-1 ring-stone-100">
                      <HeroIconImage src={icon} className="h-8 w-8" />
                    </span>
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-4 hidden max-w-4xl overflow-hidden rounded-3xl border border-stone-100 bg-white/82 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur sm:grid-cols-2 2xl:grid 2xl:grid-cols-4">
                {stats.map((stat) => {
                  return (
                    <div key={stat.label} className="flex items-center gap-2.5 border-stone-200 px-3.5 py-2.5 xl:border-r xl:last:border-r-0">
                      <HeroIconImage src={stat.icon} className="h-9 w-9 shrink-0" />
                      <span>
                        <span className="block text-base font-black text-slate-950">{stat.value}</span>
                        <span className="block text-xs font-semibold text-slate-500">{stat.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative lg:-mr-4 xl:-mr-8">
            <div className="mx-auto max-w-3xl">
                  <img loading="lazy"
                    src={heroToolsImage}
                    alt="FileBrother document upload illustration"
                    width="1400"
                    height="900"
                    fetchPriority="high"
                    decoding="async"
                    className="mx-auto h-52 w-full object-contain drop-shadow-3xl sm:h-72 lg:h-[23rem] xl:h-[27rem] 2xl:h-[30rem]"
                  />
                </div>
          </div>
        </div>

        <div id="quick-tools" className="relative z-10 mt-6 rounded-lg border border-stone-200 bg-white/92 p-3 shadow-xl shadow-slate-200/60 backdrop-blur lg:mt-3">
          <div className="grid gap-4 lg:grid-cols-[210px_1fr_auto] lg:items-center">
            <div className="px-2">
              <h2 className="text-base font-black text-slate-950">Popular Tools</h2>
              <p className="mt-0.5 text-[11px] font-medium leading-4 text-slate-500">Quick access to the most used PDF tools</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
              {popularTools.map((tool) => {
                return (
                  <a key={tool.title} href={tool.href} className="group rounded-lg border border-transparent p-2 text-center hover:border-stone-200 hover:bg-stone-50">
                    <HeroIconImage src={tool.icon} className="mx-auto h-10 w-10 transition group-hover:scale-105" />
                    <span className="mt-1 block text-[11px] font-bold text-slate-900 group-hover:text-[#9a6514]">{tool.title}</span>
                  </a>
                );
              })}
            </div>
            <a href="#tools" className="flex min-h-12 items-center justify-center gap-3 rounded-lg bg-slate-950 px-5 py-3 text-center text-xs font-black text-white shadow-lg shadow-slate-200 hover:bg-slate-800">
              View All Tools
              <FiArrowRight className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
