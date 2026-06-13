const steps = [
  'Choose or drop a PDF file into the upload area.',
  'Wait while the document is converted into DOCX format.',
  'Download the converted Word file when processing is complete.',
];

const Howto_convert_pdf = () => {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">How to use</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Convert a PDF in three steps</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The upload area is the main workspace. Keep the file ready, then download the result after conversion.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-medium leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howto_convert_pdf;
