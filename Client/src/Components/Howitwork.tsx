const steps = [
  {
    title: 'Choose a tool',
    description: 'Select the document task you need, such as PDF to Word or Word to PDF.',
  },
  {
    title: 'Upload your file',
    description: 'Choose a supported file or drag it into the upload area on the tool page.',
  },
  {
    title: 'Download the result',
    description: 'The processed file is returned to your browser with a clear download action.',
  },
];

const Howitwork = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">How it works</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Three simple steps</h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Howitwork;
