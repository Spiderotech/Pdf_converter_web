import { FiScissors } from 'react-icons/fi';
import BrowserPdfToolPage from '../Components/tools/BrowserPdfToolPage';

const Split_pdf_page = () => (
  <BrowserPdfToolPage
    mode="split"
    title="Split PDF"
    eyebrow="PDF split"
    description="Extract selected pages from a PDF using simple page ranges."
    icon={FiScissors}
  />
);

export default Split_pdf_page;
