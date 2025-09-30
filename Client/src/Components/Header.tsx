import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { useState, useEffect } from 'react';
import { To, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../src/redux/reducer/userSlice';
import profile from "../assets/profile.png"

const navigation = [
  { name: 'PDF to Word', href: '/pdf-to-word', current: true },
  { name: 'Word to PDF', href: '/word-to-pdf', current: false },
];

type RootState = {
  user: {
    value: {
      id: string | null;
      name: string | null;
      email: string | null;
      access_token: string | null;
    };
  };
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userdata = useSelector((state: RootState) => state.user.value);

  console.log(userdata);
  

  const isAuthenticated = Boolean(userdata?.access_token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNavigation = (path: To) => {
    navigate(path);
  };

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="block h-6 w-6 group-data-[open]:hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="hidden h-6 w-6 group-data-[open]:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <a href='/' className=' cursor-pointer'>
              <img
                alt="Your Company"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />

              </a>
              
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className="block w-full rounded-md px-3 py-2 text-black text-left text-base font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="relative rounded-md bg-indigo-700 px-3 py-2 text-white hover:bg-orange-500 hidden sm:inline-flex"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="ml-3 relative rounded-md bg-orange-500 px-3 py-2 text-white hover:bg-indigo-700 hidden sm:inline-flex"
                >
                  Register
                </button>
              </>
            ) : (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={profile}
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    <a href="/account" className="block px-4 py-2 text-sm text-gray-700">
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className="block w-full rounded-md px-3 py-2 text-black hover:bg-orange-300 text-left text-base font-medium"
            >
              {item.name}
            </DisclosureButton>
          ))}
          {!isAuthenticated && (
            <>
              <DisclosureButton
                as="button"
                onClick={() => handleNavigation('/login')}
                className="block w-full rounded-md px-3 py-2 text-black hover:bg-orange-300 text-left text-base font-medium"
              >
                Login
              </DisclosureButton>
              <DisclosureButton
                as="button"
                onClick={() => handleNavigation('/register')}
                className="block w-full rounded-md px-3 py-2 text-black hover:bg-orange-300 text-left text-base font-medium"
              >
                Register
              </DisclosureButton>
            </>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Header;
