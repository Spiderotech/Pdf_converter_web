import React from 'react'

const Wordconverter_feature = () => {
  return (
    <div className="pb-16" style={{ fontFamily: '"Lato", sans-serif' }}>
      {/* Code block starts */}
      <section className="max-w-8xl mx-auto container bg-white ">
        <div>
          
          <div
            tabIndex={0}
            aria-label="group of cards"
            className="focus:outline-none mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4"
          >
            {[
              {
                title: 'Quick and Efficient Processing',
                description:
                  'Converting Word to PDF is a breeze. Simply upload your Word file, relax, and your PDF will be ready in no time. We support both DOC and DOCX formats.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG1.svg',
                alt: 'drawer',
              },
              {
                title: 'Secure Online PDF Conversion',
                description:
                  'Your file security is our priority. All converted files are automatically deleted from our servers after 1 hour. Want to keep your files longer? Create a free Smallpdf account to store them online.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG2.svg',
                alt: 'check',
              },
              {
                title: 'Cross-Platform Compatibility',
                description:
                  'Our Word to PDF converter works on any device or operating system. As a browser-based tool, you can access it from your PC, phone, or tablet—anytime, anywhere.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG3.svg',
                alt: 'html tag',
              },
              {
                title: 'Multiple File Format Support',
                description:
                  'We have chosen the bright color palettes that arouse the only positive emotions. The kit that simply assures to be loved by everyone.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg',
                alt: 'monitor',
              },
              {
                title: 'Advanced Conversion Features',
                description:
                  'For heavy users, Smallpdf Pro offers the ability to batch convert Word files to PDF, with support for files up to 1 GB..',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg',
                alt: 'monitor',
              },
              {
                title: 'Cloud-Based Workflow',
                description:
                  'Enhance your digital workflow by converting DOC files to PDF, then previewing, editing, and storing them securely in the cloud.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg',
                alt: 'monitor',
              },
            ].map((card, index) => (
              <div key={index} tabIndex={0} aria-label={`card ${index + 1}`} className="focus:outline-none flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-5">
                  <div className="bg-sky-400 rounded w-16 h-16 flex items-center justify-center">
                    <img src={card.img} alt={card.alt} />
                  </div>
                </div>
                <h2 tabIndex={0} className="focus:outline-none text-lg font-semibold leading-tight text-gray-800">
                  {card.title}
                </h2>
                <p tabIndex={0} className="focus:outline-none text-base text-gray-600 leading-normal pt-2">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Code block ends */}
    </div>
  )
}

export default Wordconverter_feature
