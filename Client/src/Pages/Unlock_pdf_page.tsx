import { FiUnlock } from 'react-icons/fi';
import ServerPdfToolPage from '../Components/tools/ServerPdfToolPage';

const Unlock_pdf_page = () => (
  <ServerPdfToolPage
    title="Unlock PDF"
    eyebrow="PDF unlock"
    description="Remove password protection from PDFs when the correct password is provided."
    endpoint="/unlockpdf"
    accept=".pdf"
    outputName="unlocked.pdf"
    icon={FiUnlock}
    needsPassword
    passwordLabel="Current PDF password"
  />
);

export default Unlock_pdf_page;
