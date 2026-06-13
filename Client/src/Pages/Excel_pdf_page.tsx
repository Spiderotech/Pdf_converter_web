import { FiFileText } from 'react-icons/fi';
import ServerPdfToolPage from '../Components/tools/ServerPdfToolPage';

const Excel_pdf_page = () => (
  <ServerPdfToolPage
    title="Excel to PDF"
    eyebrow="Spreadsheet conversion"
    description="Convert Excel workbooks into PDF files while preserving readable table layout."
    endpoint="/exceltopdf"
    accept=".xls,.xlsx"
    outputName="spreadsheet.pdf"
    icon={FiFileText}
  />
);

export default Excel_pdf_page;
