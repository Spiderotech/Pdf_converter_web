import { IconType } from 'react-icons';
import { FiAlertCircle, FiCheckCircle, FiClock, FiUploadCloud } from 'react-icons/fi';
import Footer from '../Footer';
import Header from '../Header';

type PlannedToolPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  acceptedFormats: string;
  maxFileSize?: string;
  icon: IconType;
  accentClass: string;
  steps: string[];
  implementationNotes: string[];
};

const PlannedToolPage = ({
  title,
  eyebrow,
  description,
  acceptedFormats,
  maxFileSize = '25 MB',
  icon: Icon,
  accentClass,
  steps,
  implementationNotes,
}: PlannedToolPageProps) => {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={`text-sm font-semibold uppercase tracking-wide ${accentClass}`}>{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
          </div>

          <div className="mt-10 rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white ${accentClass}`}>
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-950">Tool screen ready</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              The interface is prepared for this feature. Backend processing will be connected in the next implementation step.
            </p>

            <button
              type="button"
              disabled
              className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-400 px-5 py-3 text-sm font-semibold text-white"
            >
              <FiUploadCloud className="h-4 w-4" />
              Upload coming soon
            </button>

            <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Formats</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{acceptedFormats}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended limit</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{maxFileSize}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <FiClock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-950">Planned workflow</h2>
              </div>
              <div className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-slate-950">Implementation notes</h2>
              </div>
              <div className="mt-5 space-y-3">
                {implementationNotes.map((note) => (
                  <div key={note} className="flex gap-3">
                    <FiAlertCircle className="mt-1 h-4 w-4 flex-none text-slate-400" />
                    <p className="text-sm leading-6 text-slate-600">{note}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PlannedToolPage;
