import Header from '../Components/Header'
import Footer from '../Components/Footer'

const sections = [
  {
    title: 'Use of the tools',
    text: 'Use the website only for files you own or are allowed to process. Do not upload illegal, harmful, or unauthorized documents.',
  },
  {
    title: 'No guarantee of perfect conversion',
    text: 'Document conversion can vary based on file quality, layout, fonts, and source formatting. Always review the downloaded result before relying on it.',
  },
  {
    title: 'Temporary processing',
    text: 'Files should be processed temporarily for the selected tool. Permanent file storage should not be enabled unless the website clearly explains it.',
  },
  {
    title: 'Service changes',
    text: 'Tools, limits, supported file types, and hosting providers may change as the website is updated.',
  },
];

const Termsconditionpage = () => {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Legal</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Terms and Conditions</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            These draft terms are written for a public document tools website. Review with a qualified professional before launch.
          </p>

          <div className="mt-10 space-y-4">
            {sections.map((section) => (
              <section key={section.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Termsconditionpage
