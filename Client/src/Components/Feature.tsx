import React from 'react';

const Feature = () => {
  return (
    <div className="pb-16" style={{ fontFamily: '"Lato", sans-serif' }}>
      {/* Code block starts */}
      <section className="max-w-8xl mx-auto container bg-white pt-16">
        <div>
          <div role="contentinfo" className="flex items-center flex-col px-4">
            <h1 tabIndex={0} className="focus:outline-none text-4xl lg:text-4xl font-extrabold text-center leading-10 text-gray-800 lg:w-5/12 md:w-9/12 pt-4">Why Choose Our Converter?</h1>
          </div>
          <div tabIndex={0} aria-label="group of cards" className="focus:outline-none mt-20 flex flex-wrap justify-center gap-10 px-4">
            <div tabIndex={0} aria-label="card 1" className="focus:outline-none flex sm:w-full md:w-5/12 pb-20">
              <div className="w-20 h-20 relative mr-5">
                <div className="absolute text-white bottom-0 left-0 bg-indigo-700 rounded w-16 h-16 flex items-center justify-center mt-2 mr-3">
                  <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG1.svg" alt="drawer" />
                </div>
              </div>
              <div className="w-10/12">
                <h2 tabIndex={0} className="focus:outline-none text-lg font-bold leading-tight text-gray-800">Fast and Easy Conversions</h2>
                <p tabIndex={0} className="focus:outline-none text-base text-gray-600 leading-normal pt-2">Convert your PDF to Word or Word to PDF in just a few clicks. Our tool is designed to be user-friendly and efficient, saving you time and effort.</p>
              </div>
            </div>
            <div tabIndex={0} aria-label="card 2" className="focus:outline-none flex sm:w-full md:w-5/12 pb-20">
              <div className="w-20 h-20 relative mr-5">
                <div className="absolute text-white bottom-0 left-0 bg-indigo-700 rounded w-16 h-16 flex items-center justify-center mt-2 mr-3">
                  <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG2.svg" alt="check" />
                </div>
              </div>
              <div className="w-10/12">
                <h2 tabIndex={0} className="focus:outline-none text-lg font-semibold leading-tight text-gray-800">High-Quality Results</h2>
                <p tabIndex={0} className="focus:outline-none text-base text-gray-600 leading-normal pt-2">Our converter ensures that your documents retain their formatting, layout, and quality, providing you with professional results every time.</p>
              </div>
            </div>
            <div tabIndex={0} aria-label="card 3" className="focus:outline-none flex sm:w-full md:w-5/12 pb-20">
              <div className="w-20 h-20 relative mr-5">
                <div className="absolute text-white bottom-0 left-0 bg-indigo-700 rounded w-16 h-16 flex items-center justify-center mt-2 mr-3">
                  <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG3.svg" alt="html tag" />
                </div>
              </div>
              <div className="w-10/12">
                <h2 tabIndex={0} className="focus:outline-none text-lg font-semibold leading-tight text-gray-800">Secure and Reliable</h2>
                <p tabIndex={0} className="focus:outline-none text-base text-gray-600 leading-normal pt-2">Your files are handled with the utmost security, ensuring that your data remains private and safe throughout the conversion process.</p>
              </div>
            </div>
            <div tabIndex={0} aria-label="card 4" className="focus:outline-none flex sm:w-full md:w-5/12 pb-20">
              <div className="w-20 h-20 relative mr-5">
                <div className="absolute text-white bottom-0 left-0 bg-indigo-700 rounded w-16 h-16 flex items-center justify-center mt-2 mr-3">
                  <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg" alt="monitor" />
                </div>
              </div>
              <div className="w-10/12">
                <h2 tabIndex={0} className="focus:outline-none text-lg font-semibold leading-tight text-gray-800">No Installation Required</h2>
                <p tabIndex={0} className="focus:outline-none text-base text-gray-600 leading-normal pt-2">Our online converter works directly in your browser, so there’s no need to download or install any software. Start converting instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feature;
