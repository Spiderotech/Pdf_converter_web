import { FiMonitor } from 'react-icons/fi';
import ServerPdfToolPage from '../Components/tools/ServerPdfToolPage';

const Pptx_to_pdf_page = () => (
  <ServerPdfToolPage
    title="PPTX to PDF"
    eyebrow="Presentation conversion"
    description="Convert PowerPoint presentations into PDF files for easy sharing."
    endpoint="/pptxtopdf"
    accept=".ppt,.pptx"
    outputName="presentation.pdf"
    icon={FiMonitor}
  />
);

export default Pptx_to_pdf_page;
