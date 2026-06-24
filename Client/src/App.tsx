import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./Pages/Homepage";
import Word_converter_page from "./Pages/Word_converter_page";
import Pdf_converter_page from "./Pages/Pdf_converter_page";
import Privacy_policypage from './Pages/Privacy_policypage';
import Termsconditionpage from './Pages/Termsconditionpage';
import Compress_pdf_page from './Pages/Compress_pdf_page';
import Merge_pdf_page from './Pages/Merge_pdf_page';
import Split_pdf_page from './Pages/Split_pdf_page';
import Sign_pdf_page from './Pages/Sign_pdf_page';
import Edit_pdf_page from './Pages/Edit_pdf_page';
import Pptx_to_pdf_page from './Pages/Pptx_to_pdf_page';
import Xlsx_to_csv_page from './Pages/Xlsx_to_csv_page';
import Excel_pdf_page from './Pages/Excel_pdf_page';
import Unlock_pdf_page from './Pages/Unlock_pdf_page';
import Protect_pdf_page from './Pages/Protect_pdf_page';
import About_page from './Pages/About_page';
import Contact_page from './Pages/Contact_page';
import Faq_page from './Pages/Faq_page';
import NotFoundPage from './Pages/NotFoundPage';
import SeoManager from './Components/SeoManager';
import BlogPage from './Pages/BlogPage';
import BlogArticlePage from './Pages/BlogArticlePage';

function App() {
  return (
    <BrowserRouter>
      <SeoManager />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="pdf-to-word" element={<Pdf_converter_page />} />
        <Route path="word-to-pdf" element={<Word_converter_page />} />
        <Route path="compress-pdf" element={<Compress_pdf_page />} />
        <Route path="merge-pdf" element={<Merge_pdf_page />} />
        <Route path="split-pdf" element={<Split_pdf_page />} />
        <Route path="sign-pdf" element={<Sign_pdf_page />} />
        <Route path="edit-pdf" element={<Edit_pdf_page />} />
        <Route path="pptx-to-pdf" element={<Pptx_to_pdf_page />} />
        <Route path="xlsx-to-csv" element={<Xlsx_to_csv_page />} />
        <Route path="excel-to-pdf" element={<Excel_pdf_page />} />
        <Route path="unlock-pdf" element={<Unlock_pdf_page />} />
        <Route path="protect-pdf" element={<Protect_pdf_page />} />
        <Route path="privacy" element={<Privacy_policypage />} />
        <Route path="terms-and-conditions" element={<Termsconditionpage />} />
        <Route path="terms&conditions" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="about" element={<About_page />} />
        <Route path="contact" element={<Contact_page />} />
        <Route path="faq" element={<Faq_page />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
