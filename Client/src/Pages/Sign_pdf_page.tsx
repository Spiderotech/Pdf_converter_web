import { FiPenTool } from 'react-icons/fi';
import BrowserPdfToolPage from '../Components/tools/BrowserPdfToolPage';

const Sign_pdf_page = () => (
  <BrowserPdfToolPage
    mode="sign"
    title="Sign PDF"
    eyebrow="PDF signature"
    description="Add a visual PNG or JPG signature image to the first page of a PDF."
    icon={FiPenTool}
  />
);

export default Sign_pdf_page;
