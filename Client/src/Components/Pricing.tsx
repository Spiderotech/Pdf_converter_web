const plannedTools = [
  'Compress PDF',
  'Merge PDF',
  'Split PDF',
  'Sign PDF',
  'Edit PDF',
  'PPTX to PDF',
  'XLSX to CSV',
  'Protect PDF',
];

const Pricing = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Roadmap</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">More tools are planned for the public launch</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The first update should keep the site free to use, fast to load, and simple enough for AdSense review.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {plannedTools.map((tool) => (
            <div key={tool} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
