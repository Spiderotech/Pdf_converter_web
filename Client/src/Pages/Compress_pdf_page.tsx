import { FiArchive } from 'react-icons/fi';
import ServerPdfToolPage from '../Components/tools/ServerPdfToolPage';

const Compress_pdf_page = () => (
  <ServerPdfToolPage
    title="Compress PDF"
    eyebrow="PDF compression"
    description="Reduce PDF file size using backend compression. Best results are usually on scanned or image-heavy PDFs."
    endpoint="/compresspdf"
    accept=".pdf"
    outputName="compressed.pdf"
    icon={FiArchive}
    qualityOptions={[
      { label: 'Medium compression - recommended', value: 'ebook' },
      { label: 'High compression - smaller file', value: 'screen' },
      { label: 'Low compression - better quality', value: 'printer' },
    ]}
  />
);

export default Compress_pdf_page;
