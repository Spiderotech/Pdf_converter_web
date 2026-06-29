import { useMemo, useState } from 'react';
import { FiArrowRight, FiBookOpen, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import { BlogPost, blogPosts } from '../data/blogPosts';

const categoryOrder = ['Document', 'Ebook', 'Data', 'Config', 'Subtitle', 'Spreadsheet', 'Database', 'Presentation', 'CAD', 'Image', 'Design', 'Audio', 'Video', 'Archive', 'Code', 'Executable', '3D', 'Font', 'Security', 'Misc', 'Map/GIS'];

const getDetail = (post: BlogPost, property: string) => (
  post.fileDetails.find((detail) => detail.property === property)?.value ?? ''
);

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('Document');

  const categoryCounts = useMemo(() => Object.fromEntries(
    categoryOrder.map((category) => [
      category,
      blogPosts.filter((post) => getDetail(post, 'Category') === category).length,
    ]),
  ), []);

  const visiblePosts = useMemo(() => (
    blogPosts.filter((post) => getDetail(post, 'Category') === activeCategory)
  ), [activeCategory]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8f6f0] px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-bold text-[#9a6514]"><FiBookOpen aria-hidden="true" /> File guides</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">FileBrother Blog</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Choose a category and explore simple guides about common file formats.
            </p>
          </header>

          <section className="mt-10" aria-labelledby="category-title">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#9a6514]">Browse formats</p>
                <h2 id="category-title" className="mt-2 text-2xl font-black text-slate-950">Categories</h2>
              </div>
              <p className="text-sm text-slate-500">{blogPosts.length} total guides</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {categoryOrder.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`rounded-lg border p-3 text-left transition ${
                    activeCategory === category
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-stone-200 bg-white text-slate-700 hover:border-amber-300'
                  }`}
                >
                  <strong className="block text-sm">{category}</strong>
                  <span className={`mt-1 block text-xs ${activeCategory === category ? 'text-slate-300' : 'text-slate-500'}`}>{categoryCounts[category]} guides</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="guides-title">
            <div className="border-b border-stone-300 pb-4">
              <h2 id="guides-title" className="text-3xl font-black text-slate-950">{activeCategory} file guides</h2>
              <p className="mt-2 text-sm text-slate-500">{visiblePosts.length} formats in this category</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => {
                const extension = getDetail(post, 'Extension');
                const mimeType = getDetail(post, 'MIME Type');

                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group flex min-h-64 flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a6514]">{activeCategory}</p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">{post.shortTitle}</h3>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-slate-600"><FiFileText aria-hidden="true" /></span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">{post.description}</p>

                    <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-stone-50 p-3">
                        <dt className="font-bold text-slate-500">Extension</dt>
                        <dd className="mt-1 font-black text-slate-900">{extension}</dd>
                      </div>
                      <div className="min-w-0 rounded-lg bg-stone-50 p-3">
                        <dt className="font-bold text-slate-500">MIME type</dt>
                        <dd className="mt-1 truncate font-semibold text-slate-900" title={mimeType}>{mimeType}</dd>
                      </div>
                    </dl>

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#9a6514] group-hover:text-slate-950">
                      Read complete guide <FiArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
