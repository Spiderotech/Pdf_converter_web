import { useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiChevronDown,
  FiHelpCircle,
  FiMail,
  FiSearch,
} from 'react-icons/fi';
import professionalDeleteIcon from '../assets/hero-icons/professional/delete.webp';
import professionalSecureIcon from '../assets/hero-icons/professional/secure.webp';
import professionalToolsIcon from '../assets/hero-icons/professional/tools.webp';
import professionalUsersIcon from '../assets/hero-icons/professional/users.webp';
import downloadIcon from '../assets/support-icons/download.webp';
import helpIcon from '../assets/support-icons/help.webp';
import uploadIcon from '../assets/support-icons/upload.webp';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const categories = [
  { name: 'General', icon: helpIcon },
  { name: 'File & Upload', icon: uploadIcon },
  { name: 'Tools & Features', icon: professionalToolsIcon },
  { name: 'Privacy & Security', icon: professionalSecureIcon },
  { name: 'Troubleshooting', icon: professionalDeleteIcon },
  { name: 'Account', icon: professionalUsersIcon },
];

const featuredCategories = [
  { icon: uploadIcon, text: 'Uploading Files', category: 'File & Upload' },
  { icon: professionalSecureIcon, text: 'Privacy & Security', category: 'Privacy & Security' },
  { icon: downloadIcon, text: 'Output & Download', category: 'Tools & Features' },
  { icon: professionalToolsIcon, text: 'Tools & Features', category: 'Tools & Features' },
];

const questions = [
  { category: 'General', question: 'What types of files do you support?', answer: 'FileBrother supports PDF, Word, Excel, PowerPoint, CSV, PNG, and JPG workflows. Each tool page lists its accepted formats.' },
  { category: 'File & Upload', question: 'Is there a file size limit?', answer: 'Most tools currently accept files up to 25 MB. The upload area on each tool shows its specific limit.' },
  { category: 'Privacy & Security', question: 'Are my files stored or shared?', answer: 'Files are used only to complete the selected operation. We do not sell or intentionally share uploaded documents.' },
  { category: 'Privacy & Security', question: 'How secure is my data?', answer: 'The site uses secure connections and temporary processing. Browser-based tools process files locally when possible.' },
  { category: 'Account', question: 'Do I need to create an account?', answer: 'No account is required for the public document tools. Account features may be offered for saved preferences or future services.' },
  { category: 'General', question: 'Are your tools free to use?', answer: 'The currently available public tools can be used without payment. Any future paid feature will be clearly identified.' },
  { category: 'Tools & Features', question: 'Why did my converted document look different?', answer: 'Complex fonts, layouts, and embedded objects can convert differently. Always review the generated file before relying on it.' },
  { category: 'Troubleshooting', question: 'Why did my file fail to process?', answer: 'Confirm the file format, file-size limit, and password where applicable. A damaged or unsupported source file may also fail.' },
];

const Faq_page = () => {
  const [category, setCategory] = useState('General');
  const [search, setSearch] = useState('');
  const [openQuestion, setOpenQuestion] = useState(0);

  const visibleQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return questions.filter((item) => (
      (query ? `${item.question} ${item.answer}`.toLowerCase().includes(query) : item.category === category)
    ));
  }, [category, search]);

  return (
    <>
      <Header />
      <main className="bg-[#f8f6f0] py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <header className="text-center">
            <p className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm font-extrabold uppercase text-[#9a6514]"><FiHelpCircle /> Help Center</p>
            <h1 className="mt-6 text-4xl font-black text-slate-950 sm:text-5xl">Frequently Asked Questions</h1>
            <p className="mt-4 text-base font-medium text-slate-600">Find answers to common questions about our tools and services.</p>
            <div className="relative mx-auto mt-7 max-w-xl">
              <FiSearch className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for answers..." className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-14 pr-5 text-sm outline-none shadow-sm focus:border-amber-300" />
            </div>
          </header>

          <section className="mt-10 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map(({ icon, text, category: nextCategory }) => (
              <button key={text} type="button" onClick={() => { setSearch(''); setCategory(nextCategory); }} className="flex min-h-20 items-center justify-start gap-4 rounded-lg border border-stone-100 p-3 text-left text-sm font-bold text-slate-700 hover:border-amber-200 hover:text-[#9a6514] lg:min-h-24 lg:justify-center lg:border-0 lg:border-r lg:last:border-r-0">
                <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16" />
                {text}
              </button>
            ))}
          </section>

          <div className="mt-7 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:self-start">
              <h2 className="px-3 py-3 font-extrabold text-slate-950">Categories</h2>
              {categories.map(({ name, icon }) => (
                <button key={name} type="button" onClick={() => { setCategory(name); setSearch(''); setOpenQuestion(0); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold ${category === name && !search ? 'bg-stone-100 text-[#9a6514]' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <img src={icon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
                  <span className="flex-1">{name}</span>
                </button>
              ))}
              <div className="mt-4 rounded-lg bg-stone-50 p-5">
                <img src={helpIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain" />
                <h3 className="mt-3 font-extrabold text-slate-950">Still need help?</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">Our support team is ready to help.</p>
                <a href="/contact" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-bold text-white hover:bg-slate-800">Contact Support <FiArrowRight /></a>
              </div>
            </aside>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-950">{search ? 'Search results' : category}</h2>
              <div className="mt-5 space-y-3">
                {visibleQuestions.map((item, index) => {
                  const open = openQuestion === index;
                  return (
                    <article key={item.question} className={`rounded-lg border ${open ? 'border-amber-200 bg-stone-50/70' : 'border-slate-200'}`}>
                      <button type="button" onClick={() => setOpenQuestion(open ? -1 : index)} className="flex w-full items-center gap-4 p-4 text-left">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-black text-[#9a6514] shadow-sm">Q</span>
                        <strong className="flex-1 text-sm text-slate-900">{item.question}</strong>
                        <FiChevronDown className={`h-5 w-5 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
                      </button>
                      {open && <p className="px-4 pb-5 text-sm font-medium leading-7 text-slate-600 sm:px-16">{item.answer}</p>}
                    </article>
                  );
                })}
                {visibleQuestions.length === 0 && <p className="rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">No matching questions found.</p>}
              </div>
            </section>
          </div>

          <section className="mt-8 flex flex-col items-start justify-between gap-6 rounded-lg border border-stone-200 bg-white p-7 sm:flex-row sm:items-center">
            <div><h2 className="text-2xl font-black text-slate-950">Have more questions?</h2><p className="mt-2 text-sm text-slate-600">Our support team usually responds within a few hours.</p></div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><a href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-bold text-white hover:bg-slate-800">Contact Support <FiArrowRight /></a><a href="mailto:support@filebrother.com" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-stone-200 px-6 text-sm font-bold text-slate-800 hover:bg-stone-50"><FiMail /> Email Us</a></div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Faq_page;
