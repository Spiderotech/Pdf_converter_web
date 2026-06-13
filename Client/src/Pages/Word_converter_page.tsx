import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Wordconverter_feature from '../Components/Wordconverter_feature'
import Howto_convert_word from '../Components/Howto_convert_word'
import WordConverter from '../Components/Word_converter'

const Word_converter_page = () => {
  return (
    <>
      <Header />
      <WordConverter />
      <Wordconverter_feature />
      <Howto_convert_word />
      <Footer />
    </>
  )
}

export default Word_converter_page
