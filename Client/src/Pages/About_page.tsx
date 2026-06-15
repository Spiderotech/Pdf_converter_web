import {
  FiArrowRight,
  FiCheck,
  FiHeadphones,
  FiShield,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import professionalFastIcon from '../assets/hero-icons/professional/fast.png';
import professionalSecureIcon from '../assets/hero-icons/professional/secure.png';
import professionalDeleteIcon from '../assets/hero-icons/professional/delete.png';
import professionalToolsIcon from '../assets/hero-icons/professional/tools.png';
import professionalUsersIcon from '../assets/hero-icons/professional/users.png';
import professionalRatingIcon from '../assets/hero-icons/professional/rating.png';
import aboutHeroImage from '../assets/abouthero.png';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const stats = [
  { icon: professionalUsersIcon, value: '500K+', label: 'Happy users', text: 'Trust FileBrother every day' },
  { icon: professionalToolsIcon, value: '2M+', label: 'Files processed', text: 'Handled with speed and care' },
  { icon: professionalRatingIcon, value: '100+', label: 'Countries reached', text: 'Loved by users worldwide' },
  { icon: professionalSecureIcon, value: '99.9%', label: 'Reliable uptime', text: 'Always here when you need us' },
];

const capabilities = [
  { icon: professionalToolsIcon, title: 'Convert', text: 'Convert between PDF, Word, Excel, PowerPoint, and CSV workflows.', tone: 'bg-orange-50 text-orange-600' },
  { icon: professionalFastIcon, title: 'Compress', text: 'Reduce file size while keeping documents practical to share.', tone: 'bg-green-50 text-green-700' },
  { icon: professionalRatingIcon, title: 'Sign', text: 'Add visual signatures to selected PDF pages with a clear preview.', tone: 'bg-violet-50 text-violet-700' },
  { icon: professionalSecureIcon, title: 'Secure', text: 'Protect or unlock files with password-focused PDF tools.', tone: 'bg-red-50 text-red-600' },
  { icon: professionalDeleteIcon, title: 'Edit', text: 'Add text, shapes, drawings, and images to PDFs in the browser.', tone: 'bg-blue-50 text-blue-700' },
];

const trustPoints = [
  'Temporary files are removed after processing.',
  'Secure connections protect uploads and downloads.',
  'We never sell or intentionally share uploaded files.',
  'Simple, focused tools work across modern devices.',
];

const values = [
  { icon: professionalFastIcon, title: 'Fast by default', text: 'Every screen is designed to get users from upload to download quickly.', lineTone: 'bg-[#c0841a]', accent: 'bg-[radial-gradient(circle,_rgba(192,132,26,0.14)_1px,_transparent_1px)]' },
  { icon: professionalSecureIcon, title: 'Privacy-aware', text: 'We keep privacy messaging clear and avoid unnecessary steps.', lineTone: 'bg-violet-300', accent: 'bg-[radial-gradient(circle,_rgba(124,58,237,0.14)_1px,_transparent_1px)]' },
  { icon: professionalRatingIcon, title: 'Useful polish', text: 'The app balances friendly design with practical document workflows.', lineTone: 'bg-blue-300', accent: 'bg-[radial-gradient(circle,_rgba(37,99,235,0.12)_1px,_transparent_1px)]' },
];

const heroTrustItems = [
  { icon: FiShield, label: 'Secure & Private' },
  { icon: FiZap, label: 'Fast & Efficient' },
  { icon: FiCheck, label: 'Easy to Use' },
];

const About_page = () => (
  <>
    <Header />
    <main className="overflow-hidden bg-[#fbf7ef] py-10 sm:py-14">
      <section className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="absolute -left-36 top-10 h-80 w-80 rounded-full bg-stone-200/60 blur-3xl" />
        <div className="absolute -right-32 top-28 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="absolute right-0 top-0 hidden h-40 w-40 rounded-full border-[26px] border-slate-300/45 lg:block" />
        <div className="absolute bottom-16 right-10 hidden h-48 w-48 rounded-full border border-amber-200/70 lg:block" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#9a6514] shadow-[0_14px_35px_rgba(120,83,27,0.08)]">
              <FiUsers className="h-4 w-4" />
              About FileBrother
            </p>
            <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.7rem]">
              Premium PDF tools
              <span className="block">made <span className="bg-gradient-to-r from-[#7c4f12] to-[#c0841a] bg-clip-text text-transparent">simple.</span></span>
            </h1>
            <span className="mt-5 block h-1 w-14 rounded-full bg-[#c0841a]" />
            <p className="mt-6 max-w-xl text-base font-bold leading-8 text-slate-600 sm:text-lg">
              FileBrother helps people convert, compress, edit, sign, protect, and unlock documents through clean tools that feel quick, safe, and easy to understand.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#what-we-do" className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-slate-950 px-7 text-sm font-black text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800">
                Explore tools
                <FiArrowRight className="h-5 w-5" />
              </a>
              <a href="/contact" className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white/88 px-7 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
                Contact support
                <FiHeadphones className="h-5 w-5 text-[#b7791f]" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-extrabold text-slate-600">
              {heroTrustItems.map(({ icon: Icon, label }, index) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#b7791f]" />
                  {label}
                  {index < heroTrustItems.length - 1 && <span className="ml-4 hidden h-7 w-px bg-stone-200 sm:block" />}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="absolute left-0 top-10 h-80 w-80 rounded-full border border-dashed border-[#c0841a]/30" />
            <img
              src={aboutHeroImage}
              alt="Premium PDF tools interface illustration"
              className="relative z-10 mx-auto w-full max-w-3xl object-contain drop-shadow-[0_32px_70px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>

        <section className="relative mt-8 grid gap-0 overflow-hidden rounded-[1.75rem] border border-stone-100 bg-white/88 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
          {stats.map(({ icon, value, label, text }) => (
            <div key={label} className="flex items-center gap-4 border-stone-200 p-4 lg:border-r lg:last:border-r-0">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-50 to-white shadow-sm">
                <img src={icon} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
              </span>
              <span>
                <strong className="block text-3xl font-black leading-none text-slate-950">{value}</strong>
                <span className="mt-1 block text-sm font-black text-slate-700">{label}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">{text}</span>
              </span>
            </div>
          ))}
        </section>

        <section id="what-we-do" className="relative mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9a6514]">What We Do</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-5xl">A complete document workspace</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              Each tool is shaped around a simple flow: choose a file, make the change, and download the result.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {capabilities.map(({ icon, title, text, tone }) => (
              <article
                key={title}
                className="group flex min-h-[310px] flex-col rounded-[1.5rem] border border-white/70 bg-white/90 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white to-stone-50 shadow-sm">
                  <img src={icon} alt="" aria-hidden="true" className="h-[4.5rem] w-[4.5rem] object-contain transition group-hover:scale-105" />
                </span>
                <h3 className="mt-8 text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{text}</p>
                <span className={`mt-auto flex h-12 w-12 items-center justify-center rounded-full ${tone}`}>
                  <FiArrowRight className="h-5 w-5" />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-12 grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/92 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
            <span className="absolute right-8 top-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <img src={professionalSecureIcon} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
            </span>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#9a6514]">Why Users Trust Us</p>
            <h2 className="mt-5 max-w-lg text-3xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Privacy and performance are part of the product.
            </h2>
            <span className="mt-5 block h-1 w-12 rounded-full bg-[#c0841a]" />
            <ul className="mt-8 divide-y divide-stone-100 text-sm font-semibold text-slate-700">
              {trustPoints.map((item) => (
                <li key={item} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600">
                    <FiCheck className="h-4 w-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4">
            {values.map(({ icon, title, text, lineTone, accent }) => (
              <article
                key={title}
                className="relative flex min-h-32 items-center gap-6 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/92 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/75 shadow-sm">
                  <img src={icon} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
                </span>
                <span className={`h-14 w-px ${lineTone}`} />
                <span>
                  <strong className="block text-xl font-black text-slate-950">{title}</strong>
                  <span className="mt-2 block max-w-md text-sm font-semibold leading-6 text-slate-600">{text}</span>
                </span>
                <span className={`pointer-events-none absolute right-8 top-1/2 h-20 w-32 -translate-y-1/2 bg-[length:12px_12px] opacity-80 ${accent}`} />
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-14 overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-slate-950 via-slate-900 to-[#7c4f12] p-7 text-white shadow-[0_25px_70px_rgba(15,23,42,0.24)] sm:p-9">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <FiHeadphones className="h-8 w-8" />
              </span>
              <span>
                <strong className="block text-2xl font-black">Need assistance?</strong>
                <span className="mt-1 block text-sm font-medium text-stone-200">Our support pages are ready when you need help.</span>
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-slate-950">
                Contact Support
                <FiArrowRight />
              </a>
              <a href="/faq" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 px-6 text-sm font-black text-white hover:bg-white/10">
                Visit FAQ
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
    <Footer />
  </>
);

export default About_page;
