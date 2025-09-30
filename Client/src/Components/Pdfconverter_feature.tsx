import React from 'react'

const Pdfconverter_feature = () => {
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
                title: 'How Does the PDF Converter Work?',
                description:
                  'The PDF conversion process begins with a simple drag-and-drop interface, allowing you to convert Word formats. Once the file is processed, you can easily download the converted result.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG1.svg',
                alt: 'drawer',
              },
              {
                title: 'Security & Privacy',
                description:
                  'Your security and privacy are our top priorities. All file transfers are protected by advanced TLS encryption, and to ensure your data safety, all files are automatically deleted from our servers after one hour.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG2.svg',
                alt: 'check',
              },
              {
                title: 'Convert on Any Platform',
                description:
                  'Our PDF converter operates online in the cloud, making it accessible from any device, operating system, or popular browser without the need to download any software.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG3.svg',
                alt: 'html tag',
              },
              {
                title: 'High-Quality Conversion',
                description:
                  'Whether you’re converting to or from PDF, our collaboration with Solid Documents ensures top-tier results. Experience the quality by converting Word with ease.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg',
                alt: 'monitor',
              },
              {
                title: 'Fast & Simple Conversion',
                description:
                  'Converting to and from PDF is made easy with our universal converter. Just drag and drop your files, make a few clicks, and the conversion is complete. Plus, it’s completely free.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg',
                alt: 'monitor',
              },
              {
                title: 'Access From Anywhere',
                description:
                  'We have chosen the bright color palettes that arouse the only positive emotions. The kit that simply assures to be loved by everyone.',
                img: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/icon_and_text-SVG4.svg',
                alt: 'monitor',
              },
            ].map((card, index) => (
              <div key={index} tabIndex={0} aria-label={`card ${index + 1}`} className="focus:outline-none flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-5">
                  <div className="bg-red-500 rounded w-16 h-16 flex items-center justify-center">
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

export default Pdfconverter_feature
