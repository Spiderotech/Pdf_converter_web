import { IconType } from 'react-icons';
import Footer from './Footer';
import Header from './Header';

export type LegalSection = {
  title: string;
  text: string;
  icon: IconType;
};

type LegalInfoPageProps = {
  type: 'privacy' | 'terms';
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

const LegalInfoPage = ({ eyebrow, title, description, sections }: LegalInfoPageProps) => {
  return (
    <>
      <Header />
      <main className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <section>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#9a6514]">{eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black text-slate-950 sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600">{description}</p>
            <div className="mt-7 grid gap-3 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600 sm:grid-cols-2">
              <span>Last updated: June 17, 2026</span>
              <span>Effective: June 17, 2026</span>
            </div>
          </section>

          <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <nav aria-label={`${title} sections`}>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">On this page</h2>
                <ol className="mt-4 space-y-1 border-l border-slate-200 pl-4">
                  {sections.map((section, index) => (
                    <li key={section.title}>
                      <a href={`#legal-section-${index}`} className="block py-1.5 text-sm font-medium text-slate-600 hover:text-[#9a6514]">
                        {index + 1}. {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <section>
              {sections.map((section, index) => (
                <article id={`legal-section-${index}`} key={section.title} className="scroll-mt-24 border-b border-slate-200 py-7 first:pt-0 last:border-b-0">
                  <h2 className="text-xl font-black text-slate-950">{index + 1}. {section.title}</h2>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{section.text}</p>
                </article>
              ))}
            </section>
          </div>

          <p className="mt-8 border-t border-slate-200 pt-6 text-sm font-medium leading-7 text-slate-600">
            Questions about this page can be sent through the Contact Us page.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalInfoPage;
