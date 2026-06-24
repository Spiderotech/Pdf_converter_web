import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const NotFoundPage = () => (
  <>
    <Header />
    <main className="flex min-h-[60vh] items-center justify-center bg-[#f8f6f0] px-4 py-20 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#9a6514]">404 error</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-6xl">Page not found</h1>
        <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-slate-600">
          The page may have moved or the address may be incorrect. Visit the homepage to find all available PDF and document tools.
        </p>
        <Link to="/" className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-bold text-white hover:bg-slate-800">
          Explore FileBrother tools
        </Link>
      </div>
    </main>
    <Footer />
  </>
);

export default NotFoundPage;
