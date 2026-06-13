import Header from '../Components/Header'
import Footer from '../Components/Footer'

const sections = [
  {
    title: 'File processing',
    text: 'Files uploaded to the tools are used only for the selected document task, such as conversion or preparation. The production version should delete temporary files after processing is complete.',
  },
  {
    title: 'Account data',
    text: 'The public launch is planned without mandatory login. If accounts are enabled later, the privacy policy should be updated to explain what user data is collected and why.',
  },
  {
    title: 'Analytics and ads',
    text: 'The website may use analytics or advertising services after launch. Any active service should be listed here before the site is published.',
  },
  {
    title: 'Contact',
    text: 'Users should be able to contact the website owner for privacy questions through the contact page or support email.',
  },
];

const Privacy_policypage = () => {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Legal</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Privacy Policy</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This page explains the intended privacy approach for the document tools website. Review and adapt it before production launch.
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

export default Privacy_policypage
