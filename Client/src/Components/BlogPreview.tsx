import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import pdfIcon from '../assets/hero-icons/pdf.webp';
import wordIcon from '../assets/hero-icons/word.webp';

const featuredGuides = [
  {
    title: 'PDF File Guide',
    description: 'How to open, use, and convert PDF files.',
    href: '/blog/what-is-a-pdf-file',
    icon: pdfIcon,
  },
  {
    title: 'DOCX File Guide',
    description: 'How to open, use, and convert DOCX files.',
    href: '/blog/what-is-a-docx-file',
    icon: wordIcon,
  },
];

const BlogPreview = () => (
  <section className="bg-white px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="home-guides-title">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9a6514]"><FiBookOpen /> File guides</p><h2 id="home-guides-title" className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Know what you’re working with</h2><p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">Learn how common document formats work before opening or converting them.</p></div>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-black text-[#9a6514]">View all guides <FiArrowRight /></Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {featuredGuides.map((guide) => (
          <Link key={guide.href} to={guide.href} className="group flex items-center gap-5 rounded-2xl border border-stone-200 bg-[#fbf7ef] p-5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg">
            <img src={guide.icon} alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-20 w-20 shrink-0 object-contain" />
            <span className="min-w-0 flex-1">
              <strong className="block text-xl font-black text-slate-950">{guide.title}</strong>
              <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">{guide.description}</span>
            </span>
            <FiArrowRight className="shrink-0 text-[#9a6514] transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default BlogPreview;
