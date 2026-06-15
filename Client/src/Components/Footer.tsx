import {
  FiChevronRight,
  FiFacebook,
  FiFileText,
  FiGrid,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiYoutube,
} from 'react-icons/fi';
import AdBanner from './AdBanner';
import fileBrotherLogo from '../assets/filebrother-logo.png';

const tools = [
  { label: 'PDF to Word', href: '/pdf-to-word', icon: FiFileText, color: 'border-stone-200 bg-stone-50 text-slate-700' },
  { label: 'Word to PDF', href: '/word-to-pdf', icon: FiFileText, color: 'border-amber-200 bg-amber-50 text-[#9a6514]' },
  { label: 'All Tools', href: '#tools', icon: FiGrid, color: 'border-stone-200 bg-stone-50 text-slate-700' },
];



const sectionTitle = (title: string) => (
  <div>
    <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
    <span className="mt-3 block h-1 w-7 rounded-full bg-[#b7791f]" />
  </div>
);

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 pt-12 text-white">
      <div className="absolute inset-x-0 top-0 h-2/3 bg-[#f8f6f0]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-r from-slate-950 via-slate-900 to-[#7c4f12]" />

      <div className="relative mx-auto max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <AdBanner className="mb-8 px-0 sm:px-0" label="Bottom advertisement" />

        <div className="rounded-lg border border-stone-200 bg-white px-6 py-8 text-slate-700 shadow-[0_25px_70px_rgba(15,23,42,0.14)] sm:px-8 lg:px-12 lg:py-12">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr_0.72fr_1.05fr]">
            <div>
              <a href="/" className="inline-flex items-center gap-4" aria-label="FileBrother home">
                <img
                  src={fileBrotherLogo}
                  alt=""
                  aria-hidden="true"
                  className="h-16 w-16 shrink-0 object-contain drop-shadow-lg"
                />
                <span>
                  <strong className="block text-2xl font-black text-slate-950">FileBrother</strong>
                  <span className="block text-sm font-medium text-slate-500">All-in-one PDF Tools</span>
                </span>
              </a>

              <p className="mt-7 max-w-xs text-base font-medium leading-7 text-slate-600">
                Powerful, easy-to-use tools to convert, edit, compress and manage your documents in seconds.
              </p>
            </div>

            <div>
              {sectionTitle('Tools')}
              <ul className="mt-5 divide-y divide-slate-200">
                {tools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <li key={tool.label}>
                      <a href={tool.href} className="group flex min-h-12 items-center gap-3 py-2 text-sm font-semibold text-slate-800 hover:text-[#9a6514]">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${tool.color}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{tool.label}</span>
                        <FiChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#9a6514]" />
                      </a>
                    </li>
                  );
                })}
              </ul>
              
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                {sectionTitle('Company')}
                <ul className="mt-5 space-y-4 text-sm font-medium text-slate-600">
                  <li><a href="/about" className="hover:text-[#9a6514]">About Us</a></li>
                  <li><a href="/#tools" className="hover:text-[#9a6514]">Our Tools</a></li>
                  <li><a href="/contact" className="hover:text-[#9a6514]">Contact Us</a></li>
                 
                </ul>
              </div>

             
            </div>

            <div>
               <div>
                {sectionTitle('Support')}
                <ul className="mt-5 space-y-4 text-sm font-medium text-slate-600">
                  <li><a href="/privacy" className="hover:text-[#9a6514]">Privacy Policy</a></li>
                  <li><a href="/terms&conditions" className="hover:text-[#9a6514]">Terms & Conditions</a></li>
                  <li><a href="/faq" className="hover:text-[#9a6514]">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="relative grid gap-8 py-9 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <p className="text-center text-sm font-medium text-stone-200 lg:text-left">
            © 2026 FileBrother. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-white">
           
          </div>

          <div className="flex items-center justify-center gap-3 lg:justify-end">
            {[
              { label: 'Facebook', href: '#', icon: FiFacebook },
              { label: 'Twitter', href: '#', icon: FiTwitter },
              { label: 'Instagram', href: '#', icon: FiInstagram },
              { label: 'LinkedIn', href: '#', icon: FiLinkedin },
              { label: 'YouTube', href: '#', icon: FiYoutube },
            ].map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-amber-400/20 hover:text-amber-100"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
