import { useMemo, useState } from 'react';
import { FiArrowRight, FiFileText, FiGrid, FiSearch } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import { blogPosts } from '../data/blogPosts';
import { popularTools, toolCatalog } from '../data/toolCatalog';

type SearchType = 'Tool' | 'File' | 'Blog' | 'Guide';

type SearchItem = {
  title: string;
  description: string;
  href: string;
  type: SearchType;
  category: string;
  keywords: string[];
};

const primaryFilters = ['All', 'Tools', 'Blogs', 'Guides'];
const categoryFilters = ['Image', 'Video', 'Audio', 'Document', 'Archive'];
const suggestedSearches = ['pdf tools', 'image files', 'heic', 'compress pdf', 'word to pdf', 'jpg png webp'];

const typoSynonyms: Record<string, string[]> = {
  pfd: ['pdf'],
  pdg: ['pdf'],
  word: ['doc', 'docx'],
  powerpoint: ['ppt', 'pptx'],
  photo: ['image', 'jpg', 'png', 'heic', 'webp'],
  picture: ['image', 'jpg', 'png', 'heic', 'webp'],
  zip: ['archive'],
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const getDetail = (item: SearchItem, field: string) => (
  item.keywords.find((keyword) => keyword.startsWith(`${field}:`))?.slice(field.length + 1) ?? ''
);

const levenshtein = (a: string, b: string) => {
  const matrix = Array.from({ length: a.length + 1 }, (_, row) => [row]);

  for (let column = 1; column <= b.length; column += 1) matrix[0][column] = column;

  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      matrix[row][column] = a[row - 1] === b[column - 1]
        ? matrix[row - 1][column - 1]
        : Math.min(matrix[row - 1][column - 1] + 1, matrix[row][column - 1] + 1, matrix[row - 1][column] + 1);
    }
  }

  return matrix[a.length][b.length];
};

const expandQuery = (query: string) => {
  const terms = normalize(query).split(' ').filter(Boolean);
  const expanded = new Set(terms);

  terms.forEach((term) => {
    typoSynonyms[term]?.forEach((synonym) => expanded.add(synonym));
  });

  return [...expanded];
};

const scoreItem = (item: SearchItem, terms: string[]) => {
  if (terms.length === 0) return 1;

  const haystack = normalize([
    item.title,
    item.description,
    item.type,
    item.category,
    ...item.keywords,
  ].join(' '));
  const words = haystack.split(' ');

  return terms.reduce((score, term) => {
    if (haystack.includes(term)) return score + 8;
    if (words.some((word) => word.startsWith(term))) return score + 5;
    if (words.some((word) => term.length >= 3 && levenshtein(word, term) <= 2)) return score + 3;
    return score;
  }, 0);
};

const searchItems: SearchItem[] = [
  {
    title: 'All FileBrother Tools',
    description: 'Browse every public PDF and document tool.',
    href: '/tools',
    type: 'Guide',
    category: 'Document',
    keywords: ['tools', 'directory', 'pdf', 'converter', 'document'],
  },
  {
    title: 'FileBrother Blog',
    description: 'Read FileBrother articles and file format guides.',
    href: '/blog',
    type: 'Blog',
    category: 'Document',
    keywords: ['blog', 'articles', 'guides', 'file formats', 'tutorials'],
  },
  ...toolCatalog.map((tool) => ({
    title: tool.name,
    description: tool.description,
    href: tool.path,
    type: 'Tool' as const,
    category: tool.category,
    keywords: [...tool.tags, tool.category.toLowerCase()],
  })),
  ...blogPosts.flatMap((post) => {
    const extension = post.fileDetails.find((detail) => detail.property === 'Extension')?.value.replace('.', '').toLowerCase() ?? '';
    const category = post.fileDetails.find((detail) => detail.property === 'Category')?.value ?? 'Guide';
    const baseKeywords = [
      ...post.keywords,
      `extension:${extension}`,
      category.toLowerCase(),
      extension,
      post.shortTitle,
    ];

    return [
      {
        title: post.shortTitle,
        description: post.description,
        href: `/blog/${post.slug}`,
        type: 'File' as const,
        category,
        keywords: baseKeywords,
      },
      {
        title: post.title,
        description: post.intro,
        href: `/blog/${post.slug}`,
        type: 'Guide' as const,
        category,
        keywords: [...baseKeywords, 'guide', 'blog', 'how to open', 'convert'],
      },
    ];
  }),
];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [activeFilter, setActiveFilter] = useState(params.get('type') ?? 'All');
  const [activeCategory, setActiveCategory] = useState(params.get('category') ?? 'All');

  const terms = useMemo(() => expandQuery(query), [query]);

  const results = useMemo(() => searchItems
    .map((item) => ({ item, score: scoreItem(item, terms) }))
    .filter(({ item, score }) => {
      const matchesQuery = terms.length === 0 || score > 0;
      const matchesType = activeFilter === 'All' || `${item.type}s` === activeFilter;
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

      return matchesQuery && matchesType && matchesCategory;
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, 48), [activeCategory, activeFilter, terms]);

  const autocomplete = results.slice(0, 6);
  const relatedFiles = searchItems.filter((item) => item.type === 'File' && ['jpg', 'png', 'heic', 'webp', 'pdf', 'docx'].includes(getDetail(item, 'extension'))).slice(0, 8);

  const updateSearch = (nextQuery: string, nextType = activeFilter, nextCategory = activeCategory) => {
    setQuery(nextQuery);
    setActiveFilter(nextType);
    setActiveCategory(nextCategory);
    const nextParams = new URLSearchParams();
    if (nextQuery.trim()) nextParams.set('q', nextQuery.trim());
    if (nextType !== 'All') nextParams.set('type', nextType);
    if (nextCategory !== 'All') nextParams.set('category', nextCategory);
    setParams(nextParams, { replace: true });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8f6f0] px-4 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#9a6514]"><FiSearch /> Site search</p>
            <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-6xl">Search FileBrother</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">Find tools, file guides, blog articles, and format help instantly. Typos like “pfd” still find PDF tools.</p>
          </header>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
            <label className="relative block">
              <span className="sr-only">Search FileBrother</span>
              <FiSearch className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search PDF, pfd, image, HEIC, archive..."
                className="h-16 w-full rounded-xl border border-stone-200 bg-[#fbf7ef] pl-14 pr-4 text-base font-bold text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
              />
            </label>

            {query && autocomplete.length > 0 && (
              <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {autocomplete.map(({ item }) => (
                  <Link key={`${item.type}-${item.href}`} to={item.href} className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-amber-200 hover:text-[#9a6514]">
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {primaryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => updateSearch(query, filter)}
                  className={`rounded-full px-4 py-2 text-sm font-black ${activeFilter === filter ? 'bg-slate-950 text-white' : 'bg-stone-100 text-slate-600 hover:bg-stone-200'}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => updateSearch(query, activeFilter, 'All')} className={`rounded-full px-4 py-2 text-xs font-black ${activeCategory === 'All' ? 'bg-[#9a6514] text-white' : 'bg-amber-50 text-[#9a6514]'}`}>All categories</button>
              {categoryFilters.map((category) => (
                <button key={category} type="button" onClick={() => updateSearch(query, activeFilter, category)} className={`rounded-full px-4 py-2 text-xs font-black ${activeCategory === category ? 'bg-[#9a6514] text-white' : 'bg-amber-50 text-[#9a6514]'}`}>
                  {category}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="search-results-title">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-300 pb-4">
              <div>
                <h2 id="search-results-title" className="text-3xl font-black text-slate-950">Results</h2>
                <p className="mt-1 text-sm text-slate-500">{results.length} result{results.length === 1 ? '' : 's'} found</p>
              </div>
              <Link to="/tools" className="inline-flex items-center gap-2 text-sm font-black text-[#9a6514]">Browse all tools <FiArrowRight /></Link>
            </div>

            {results.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map(({ item }) => (
                  <Link key={`${item.type}-${item.href}`} to={item.href} className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md">
                    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-slate-600"><FiFileText /> {item.type} · {item.category}</span>
                    <h3 className="mt-4 text-xl font-black text-slate-950 group-hover:text-[#9a6514]">{item.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
                <h3 className="text-2xl font-black text-slate-950">No exact results — try these instead</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestedSearches.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => updateSearch(suggestion, 'All', 'All')} className="rounded-full bg-stone-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-[#9a6514]">
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {popularTools.map((tool) => <Link key={tool.path} to={tool.path} className="rounded-xl border border-stone-200 p-4 text-sm font-black text-slate-800 hover:border-amber-200">{tool.name}</Link>)}
                </div>
              </div>
            )}
          </section>

          <section className="mt-10 rounded-2xl bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-amber-200"><FiGrid /> Related files</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedFiles.map((file) => <Link key={file.href} to={file.href} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white hover:text-slate-950">{file.title}</Link>)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchPage;
