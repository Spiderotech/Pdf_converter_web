import { FiLock } from 'react-icons/fi';
import ServerPdfToolPage from '../Components/tools/ServerPdfToolPage';

const Protect_pdf_page = () => (
  <ServerPdfToolPage
    title="Protect PDF"
    eyebrow="PDF protection"
    description="Add password protection to PDF files before sharing or archiving."
    endpoint="/protectpdf"
    accept=".pdf"
    outputName="protected.pdf"
    icon={FiLock}
    needsPassword
    passwordLabel="New PDF password"
  />
);

export default Protect_pdf_page;
