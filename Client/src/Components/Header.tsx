import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { To, useNavigate } from 'react-router-dom';
import { FiFileText, FiMenu, FiX } from 'react-icons/fi';

const navigation = [
  { name: 'Tools', href: '#tools' },
  { name: 'PDF to Word', href: '/pdf-to-word' },
  { name: 'Word to PDF', href: '/word-to-pdf' },
  { name: 'Privacy', href: '/privacy' },
];

const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: To | string) => {
    if (typeof path === 'string' && path.startsWith('#')) {
      document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(path as To);
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      {({ open }) => (
        <>
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left"
              aria-label="Go to homepage"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <FiFileText className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold text-slate-950">Converter</span>
            </button>

            <div className="hidden items-center gap-1 md:flex">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleNavigation(item.href)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/pdf-to-word')}
              className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 md:inline-flex"
            >
              Start converting
            </button>

            <DisclosureButton className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950 md:hidden">
              <span className="sr-only">Open menu</span>
              {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </DisclosureButton>
          </div>

          <DisclosurePanel className="border-t border-slate-200 bg-white md:hidden">
            <div className="space-y-1 px-4 py-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="button"
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              <DisclosureButton
                as="button"
                onClick={() => navigate('/pdf-to-word')}
                className="mt-2 block w-full rounded-md bg-blue-600 px-3 py-2 text-left text-sm font-semibold text-white"
              >
                Start converting
              </DisclosureButton>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
