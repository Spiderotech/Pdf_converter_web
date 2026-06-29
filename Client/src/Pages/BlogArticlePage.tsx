import { useEffect } from 'react';
import { FiArrowRight, FiCheck, FiMinus } from 'react-icons/fi';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import { getBlogPost } from '../data/blogPosts';

const BlogArticlePage = () => {
  const { slug = '' } = useParams();
  const post = getBlogPost(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) return <Navigate to="/404" replace />;

  const extensionName = post.fileDetails[0].value.replace('.', '').toUpperCase();
  const relatedPosts = post.relatedSlugs.map(getBlogPost).filter(Boolean);

  return (
    <>
      <Header />
      <main className="bg-[#f8f6f0] px-4 py-10 sm:px-8 sm:py-14">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-[#9a6514]">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blog" className="hover:text-[#9a6514]">Blog</Link>
            <span aria-hidden="true">/</span>
            <span>{post.shortTitle}</span>
          </nav>

          <header className="mt-8">
            <p className="text-sm font-bold text-[#9a6514]">{post.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">{post.h1}</h1>
            <p className="mt-6 text-base leading-8 text-slate-600">{post.intro}</p>
            <nav aria-label="Article quick links" className="mt-6 flex flex-wrap gap-3">
              <a
                href="#what-is-file"
                onClick={(event) => {
                  event.preventDefault();
                  document.querySelector('#what-is-file')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-amber-300 hover:text-[#9a6514]"
              >
                What is a {extensionName} file?
              </a>
              <a
                href="#how-to-open-file"
                onClick={(event) => {
                  event.preventDefault();
                  document.querySelector('#how-to-open-file')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-amber-300 hover:text-[#9a6514]"
              >
                How to open {extensionName} files
              </a>
            </nav>
          </header>

          <div className="mt-10 space-y-8">
            <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <h2 className="border-b border-stone-200 px-6 py-4 text-2xl font-black text-slate-950">File details</h2>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-stone-100">
                  {post.fileDetails.map((item) => (
                    <tr key={item.property}>
                      <th scope="row" className="w-1/3 px-6 py-4 font-bold text-slate-700">{item.property}</th>
                      <td className="break-all px-6 py-4 text-slate-600">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="what-is-file" className="scroll-mt-28">
              <h2 className="text-3xl font-black text-slate-950">What is a {extensionName} file?</h2>
              <div className="mt-4 space-y-4">
                {post.whatIsIt.map((paragraph) => <p key={paragraph} className="leading-8 text-slate-600">{paragraph}</p>)}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-950">Common uses of {extensionName} files</h2>
              <ul className="mt-4 space-y-3">
                {post.commonUses.map((item) => <li key={item} className="flex gap-3 text-slate-600"><FiCheck className="mt-1 shrink-0 text-green-600" />{item}</li>)}
              </ul>
            </section>

            <div className="grid gap-8 sm:grid-cols-2">
              <section>
                <h2 className="text-2xl font-black text-slate-950">Advantages of {extensionName}</h2>
                <ul className="mt-4 space-y-3">{post.advantages.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><FiCheck className="mt-1 shrink-0 text-green-600" />{item}</li>)}</ul>
              </section>
              <section>
                <h2 className="text-2xl font-black text-slate-950">Disadvantages of {extensionName}</h2>
                <ul className="mt-4 space-y-3">{post.disadvantages.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><FiMinus className="mt-1 shrink-0 text-amber-600" />{item}</li>)}</ul>
              </section>
            </div>

            <section id="how-to-open-file" className="scroll-mt-28">
              <h2 className="text-3xl font-black text-slate-950">How to open {extensionName} files</h2>
              <p className="mt-4 leading-8 text-slate-600">{post.openInstructions}</p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600">{post.openWith.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            <section className="rounded-xl bg-slate-950 p-6 text-white sm:p-8">
              <h2 className="text-3xl font-black">How to convert {extensionName} files</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.conversionIntro}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {post.conversions.map((conversion) => (
                  <Link key={conversion.href} to={conversion.href} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-950">
                    {conversion.label} <FiArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-950">Frequently asked questions</h2>
              <div className="mt-5 divide-y divide-stone-200 border-y border-stone-200">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="py-5">
                    <h3 className="font-black text-slate-900">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {relatedPosts.length > 0 && (
              <section>
                <h2 className="text-3xl font-black text-slate-950">Related files</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {relatedPosts.map((related) => {
                    if (!related) return null;
                    const relatedHref = `/blog/${related.slug}`;

                    return (
                      <Link key={related.slug} to={relatedHref} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-amber-300">
                        {related.shortTitle}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogArticlePage;
