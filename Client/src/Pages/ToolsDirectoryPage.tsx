import Footer from '../Components/Footer';
import Header from '../Components/Header';
import Tools from '../Components/Tools';

const ToolsDirectoryPage = () => (
  <>
    <Header />
    <main className="bg-[#f7f5ef]">
      <section className="px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9a6514]">Tool directory</p>
          <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-6xl">All FileBrother tools</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Browse every public converter and PDF utility in one indexable directory.</p>
        </div>
      </section>
      <Tools />
    </main>
    <Footer />
  </>
);

export default ToolsDirectoryPage;
