import React from 'react';
import { To, useNavigate } from 'react-router-dom';
import word from '../assets/microsoft-word.svg';
import pdf from '../assets/pdf-svgrepo-com.svg';

const Tools = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: To) => {
    navigate(path);
  };

  return (
    <div className="pb-16" style={{ fontFamily: '"Lato", sans-serif' }}>
      {/* Code block starts */}
      <section className="max-w-8xl mx-auto container bg-white pt-16">
        <div>
          <div role="contentinfo" className="flex items-center flex-col px-4">
            <h1
              tabIndex={0}
              className="focus:outline-none text-4xl lg:text-4xl font-extrabold text-center leading-10 text-gray-800 lg:w-5/12 md:w-9/12 pt-4"
            >
              Most Popular Tools
            </h1>
          </div>
          <div
            tabIndex={0}
            aria-label="group of cards"
            className="focus:outline-none mt-20 flex flex-wrap justify-center gap-10 px-4"
          >
            {/* Card 1 */}
            <div
              tabIndex={0}
              aria-label="PDF to Word tool"
              className="focus:outline-none flex sm:w-full md:w-5/12 border border-gray-300 rounded-lg p-5 relative cursor-pointer hover:bg-red-100"
              onClick={() => handleNavigation('/pdf-to-word')}
            >
              <div className="w-20 h-20 relative mr-5">
                <div className="absolute top-0 right-0 bg-red-100 rounded w-16 h-16 mt-2 mr-1" />
                <div className="absolute text-white bottom-0 left-0 bg-red-500 rounded w-16 h-16 flex items-center justify-center mt-2 mr-3">
                  <img
                    src={pdf}
                    className="w-12"
                    alt="PDF to Word"
                  />
                </div>
              </div>
              <div className="w-10/12">
                <h2
                  tabIndex={0}
                  className="focus:outline-none text-lg font-bold leading-tight text-gray-800"
                >
                  PDF to Word
                </h2>
                <p
                  tabIndex={0}
                  className="focus:outline-none text-base text-gray-600 leading-normal pt-2"
                >
                  Easily convert your PDF files into editable Word documents with just a few clicks.
                </p>
              </div>
              <div className="absolute right-4 top-4 text-indigo-700">
                ➔
              </div>
            </div>
            {/* Card 2 */}
            <div
              tabIndex={0}
              aria-label="Word to PDF tool"
              className="focus:outline-none flex sm:w-full md:w-5/12 border border-gray-300 rounded-lg p-5 relative cursor-pointer hover:bg-sky-100"
              onClick={() => handleNavigation('/word-to-pdf')}
            >
              <div className="w-20 h-20 relative mr-5">
                <div className="absolute top-0 right-0 bg-sky-100 rounded w-16 h-16 mt-2 mr-1" />
                <div className="absolute text-white bottom-0 left-0 bg-sky-400 rounded w-16 h-16 flex items-center justify-center mt-2 mr-3">
                  <img
                    src={word}
                    alt="Word to PDF"
                  />
                </div>
              </div>
              <div className="w-10/12">
                <h2
                  tabIndex={0}
                  className="focus:outline-none text-lg font-semibold leading-tight text-gray-800"
                >
                  Word to PDF
                </h2>
                <p
                  tabIndex={0}
                  className="focus:outline-none text-base text-gray-600 leading-normal pt-2"
                >
                  Convert your Word documents into secure, shareable PDF files quickly and easily.
                </p>
              </div>
              <div className="absolute right-4 top-4 text-indigo-700">
                ➔
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
