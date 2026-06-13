const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-lg font-semibold text-slate-950">Converter</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Professional PDF and document tools for quick file conversion and preparation.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">Tools</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="/pdf-to-word" className="hover:text-blue-600">PDF to Word</a></li>
              <li><a href="/word-to-pdf" className="hover:text-blue-600">Word to PDF</a></li>
              <li><a href="#tools" className="hover:text-blue-600">All tools</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">Legal</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="/terms&conditions" className="hover:text-blue-600">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © 2026 Converter. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
