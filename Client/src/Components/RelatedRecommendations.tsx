import { FiArrowRight } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { toolCatalog } from '../data/toolCatalog';

const relatedByPath: Record<string, string[]> = {
  '/tools/pdf-to-word': ['/tools/word-to-pdf', '/tools/compress-pdf', '/tools/edit-pdf'],
  '/tools/word-to-pdf': ['/tools/pdf-to-word', '/tools/compress-pdf', '/tools/merge-pdf'],
  '/tools/compress-pdf': ['/tools/merge-pdf', '/tools/split-pdf', '/tools/pdf-to-word'],
  '/tools/merge-pdf': ['/tools/split-pdf', '/tools/compress-pdf', '/tools/sign-pdf'],
  '/tools/split-pdf': ['/tools/merge-pdf', '/tools/compress-pdf', '/tools/edit-pdf'],
  '/tools/sign-pdf': ['/tools/edit-pdf', '/tools/merge-pdf', '/tools/protect-pdf'],
  '/tools/edit-pdf': ['/tools/sign-pdf', '/tools/merge-pdf', '/tools/split-pdf'],
  '/tools/pptx-to-pdf': ['/tools/word-to-pdf', '/tools/excel-to-pdf', '/tools/pdf-to-word'],
  '/tools/xlsx-to-csv': ['/tools/excel-to-pdf', '/blog/what-is-a-csv-file', '/blog/what-is-a-xlsx-file'],
  '/tools/excel-to-pdf': ['/tools/xlsx-to-csv', '/tools/word-to-pdf', '/blog/what-is-a-xlsx-file'],
  '/tools/unlock-pdf': ['/tools/protect-pdf', '/tools/compress-pdf', '/tools/edit-pdf'],
  '/tools/protect-pdf': ['/tools/unlock-pdf', '/tools/sign-pdf', '/tools/compress-pdf'],
};

const fallbackLabels: Record<string, string> = {
  '/blog/what-is-a-csv-file': 'CSV File Guide',
  '/blog/what-is-a-xlsx-file': 'XLSX File Guide',
};

const RelatedRecommendations = () => {
  const { pathname } = useLocation();
  const relatedPaths = relatedByPath[pathname] ?? [];

  if (relatedPaths.length === 0) return null;

  return (
    <section className="bg-[#f8f6f0] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6514]">Related recommendations</p>
        <h2 className="mt-3 text-3xl font-black text-slate-950">You may also need</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {relatedPaths.map((path) => {
            const tool = toolCatalog.find((item) => item.path === path);
            const title = tool?.name ?? fallbackLabels[path] ?? path.replace(/^\//, '');
            const description = tool?.description ?? 'Learn about this related file format.';

            return (
              <Link key={path} to={path} className="group rounded-xl border border-stone-200 bg-[#fbf7ef] p-4 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md">
                <span className="block text-lg font-black text-slate-950 group-hover:text-[#9a6514]">{title}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{description}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#9a6514]">Open <FiArrowRight /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedRecommendations;
