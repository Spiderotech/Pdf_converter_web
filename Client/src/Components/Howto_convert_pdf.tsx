import React from 'react'
import pdfgif from "../assets/pdf.gif"

const Howto_convert_pdf = () => {
  return (
    <div className="xl:mx-auto xl:container py-20 2xl:px-10 px-20 ">
            <div className="lg:flex items-center">
                <div className="lg:w-1/2 w-full">
                    <h1 role="heading" className="md:text-3xl text-xl font-bold leading-10 mt-3 text-gray-800">
                    How To Convert PDF:
                    </h1>
                    <img 
                        src={pdfgif}
                        alt="Pricing illustration" 
                        className="mt-5  w-80 object-cover"
                    />
                    
                </div>
                <div className="xl:w-1/2 lg:w-7/12 relative w-full lg:mt-0 mt-12 md:px-8" role="list">
                   
                    <div role="listitem" className="bg-white cursor-pointer shadow rounded-lg p-4 relative z-30">
                        <div className="md:flex items-center justify-between">
                            <h2 className="text-lg font-semibold leading-6 text-gray-800">1.Import or drag & drop your PDF file to our converter.</h2>
                            
                        </div>
                       
                    </div>
                    <div role="listitem" className="bg-white cursor-pointer shadow rounded-lg p-4 relative z-30 mt-2">
                        <div className="md:flex items-center justify-between">
                            <h2 className="text-lg font-semibold leading-6 text-gray-800">2.Choose to convert to Word, Excel, PowerPoint, or Image.</h2>
                           
                        </div>
                       
                    </div>
                    <div role="listitem" className="bg-white cursor-pointer shadow rounded-lg p-4 relative z-30 mt-2">
                        <div className="md:flex items-center justify-between">
                            <h2 className="text-lg font-semibold leading-6 text-gray-800">3.Click “Convert” to transform your file type.</h2>
                           
                        </div>
                       
                    </div>
                    <div role="listitem" className="bg-white cursor-pointer shadow rounded-lg p-4 relative z-30 mt-2">
                        <div className="md:flex items-center justify-between">
                            <h2 className="text-lg font-semibold leading-6 text-gray-800">4.Download your converted document when ready—easy!
                            </h2>
                           
                        </div>
                       
                    </div>
                    

                    
                </div>
            </div>
        </div>
  )
}

export default Howto_convert_pdf
