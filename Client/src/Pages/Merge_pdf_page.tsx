import { FiCopy } from 'react-icons/fi';
import BrowserPdfToolPage from '../Components/tools/BrowserPdfToolPage';

const Merge_pdf_page = () => (
  <BrowserPdfToolPage
    mode="merge"
    title="Merge PDF"
    eyebrow="PDF merge"
    description="Combine multiple PDF files into one ordered document without sending files to the backend."
    icon={FiCopy}
  />
);

export default Merge_pdf_page;
