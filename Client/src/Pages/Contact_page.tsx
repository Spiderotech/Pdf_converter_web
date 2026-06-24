import {
  FiArrowRight,
  FiCheckCircle,
  FiHeadphones,
  FiLock,
  FiShield,
} from 'react-icons/fi';
import professionalClockIcon from '../assets/hero-icons/professional/clock.webp';
import professionalSecureIcon from '../assets/hero-icons/professional/secure.webp';
import professionalUsersIcon from '../assets/hero-icons/professional/users.webp';
import emailIcon from '../assets/support-icons/email.webp';
import feedbackIcon from '../assets/support-icons/feedback.webp';
import helpIcon from '../assets/support-icons/help.webp';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const contactMethods = [
  {
    icon: emailIcon,
    title: 'Email support',
    text: 'support@filebrother.com',
    detail: 'Best for account, tool, and privacy questions.',
    href: 'mailto:support@filebrother.com?subject=FileBrother support request',
  },
  {
    icon: feedbackIcon,
    title: 'Feedback',
    text: 'Share an idea or report a problem',
    detail: 'Tell us what to improve in the tools.',
    href: 'mailto:hello@filebrother.com?subject=FileBrother feedback',
  },
  {
    icon: helpIcon,
    title: 'Help center',
    text: 'Read common answers',
    detail: 'Find quick guidance before contacting support.',
    href: '/faq',
  },
];

const supportDetails = [
  { icon: professionalClockIcon, title: 'Response time', text: 'We usually reply within 24-48 business hours.' },
  { icon: professionalSecureIcon, title: 'Privacy first', text: 'Do not send passwords or sensitive files by email.' },
  { icon: professionalUsersIcon, title: 'Remote team', text: 'Supporting FileBrother users worldwide.' },
];

const supportLinks = [
  { icon: helpIcon, title: 'Documentation', href: '/faq' },
  { icon: helpIcon, title: 'FAQ', href: '/faq' },
  { icon: feedbackIcon, title: 'Feedback', href: 'mailto:hello@filebrother.com?subject=Feedback' },
  { icon: emailIcon, title: 'Email support', href: 'mailto:support@filebrother.com' },
];

const Contact_page = () => {
  return (
    <>
      <Header />
      <main className="bg-[#f8f6f0] py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <section className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm font-extrabold uppercase text-[#9a6514]">
                <FiHeadphones />
                Contact Us
              </p>
              <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                We're here
                <br />
                to <span className="text-[#9a6514]">help</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-slate-600">
                Need support, want to report a problem, or have an idea for a new tool? Choose the best contact option below.
              </p>
              <div className="mt-7 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2">
                <span className="inline-flex items-center gap-2 border-l-4 border-[#b7791f] bg-white px-3 py-2 shadow-sm">
                  <FiShield className="text-[#9a6514]" />
                  Fast & reliable support
                </span>
                <span className="inline-flex items-center gap-2 border-l-4 border-[#b7791f] bg-white px-3 py-2 shadow-sm">
                  <FiLock className="text-[#9a6514]" />
                  Your privacy matters
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-7">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-stone-100" />
              <div className="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-amber-100/70" />
              <div className="relative">
                <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-stone-50 shadow-sm sm:h-24 sm:w-24">
                  <img src={emailIcon} alt="" aria-hidden="true" className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
                </span>
                <h2 className="mt-6 text-3xl font-black text-slate-950">Get in touch</h2>
                <p className="mt-3 max-w-lg text-sm font-medium leading-7 text-slate-600">
                  For the quickest help, include the tool name, what happened, and the browser/device you used.
                </p>

                <div className="mt-6 grid gap-3">
                  {contactMethods.map(({ icon, title, text, detail, href }) => (
                    <a
                      key={title}
                      href={href}
                      className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 hover:border-amber-200 hover:bg-stone-50 sm:items-center sm:gap-4 sm:p-4"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm sm:h-16 sm:w-16">
                        <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-sm font-black text-slate-950">{title}</strong>
                        <span className="mt-1 block text-sm font-bold text-[#9a6514]">{text}</span>
                        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{detail}</span>
                      </span>
                      <FiArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#9a6514]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-8">
              <p className="text-sm font-extrabold uppercase text-[#9a6514]">Before you contact us</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">Helpful details to include</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  'Which tool you were using',
                  'The file type and approximate size',
                  'The browser and device name',
                  'A short description of what went wrong',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl bg-stone-50 p-4 text-sm font-bold text-slate-700">
                    <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6514]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-extrabold text-slate-950">Support info</h2>
              <div className="mt-5 divide-y divide-slate-100">
                {supportDetails.map(({ icon, title, text }) => (
                  <div key={title} className="flex gap-4 py-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-stone-50">
                      <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
                    </span>
                    <span>
                      <strong className="block text-sm font-black text-slate-950">{title}</strong>
                      <span className="mt-1 block text-xs font-medium leading-5 text-slate-600">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          <section className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
            {supportLinks.map(({ icon, title, href }) => (
              <a key={title} href={href} className="flex items-center gap-4 p-3 text-sm font-bold text-slate-800 hover:text-[#9a6514]">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-stone-50">
                  <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
                </span>
                {title}
                <FiArrowRight className="ml-auto" />
              </a>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact_page;
