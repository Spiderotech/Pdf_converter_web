import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Pdfconverter_feature from '../Components/Pdfconverter_feature'
import Howto_convert_pdf from '../Components/Howto_convert_pdf'
import PdfConverter from '../Components/Pdf_converter'


const Pdf_converter_page = () => {
  return (
    <>
      <Header />
      <PdfConverter />
      <Pdfconverter_feature />
      <Howto_convert_pdf />
      <Footer />
    </>
  )
}

export default Pdf_converter_page
