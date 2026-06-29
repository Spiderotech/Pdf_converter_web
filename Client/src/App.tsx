import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CanonicalRedirect from './Components/CanonicalRedirect';
import SeoManager from './Components/SeoManager';
import AnalyticsTracker from './Components/AnalyticsTracker';

const Homepage = lazy(() => import("./Pages/Homepage"));
const Word_converter_page = lazy(() => import("./Pages/Word_converter_page"));
const Pdf_converter_page = lazy(() => import("./Pages/Pdf_converter_page"));
const Privacy_policypage = lazy(() => import('./Pages/Privacy_policypage'));
const Termsconditionpage = lazy(() => import('./Pages/Termsconditionpage'));
const Compress_pdf_page = lazy(() => import('./Pages/Compress_pdf_page'));
const Merge_pdf_page = lazy(() => import('./Pages/Merge_pdf_page'));
const Split_pdf_page = lazy(() => import('./Pages/Split_pdf_page'));
const Sign_pdf_page = lazy(() => import('./Pages/Sign_pdf_page'));
const Edit_pdf_page = lazy(() => import('./Pages/Edit_pdf_page'));
const Pptx_to_pdf_page = lazy(() => import('./Pages/Pptx_to_pdf_page'));
const Xlsx_to_csv_page = lazy(() => import('./Pages/Xlsx_to_csv_page'));
const Excel_pdf_page = lazy(() => import('./Pages/Excel_pdf_page'));
const Unlock_pdf_page = lazy(() => import('./Pages/Unlock_pdf_page'));
const Protect_pdf_page = lazy(() => import('./Pages/Protect_pdf_page'));
const About_page = lazy(() => import('./Pages/About_page'));
const Contact_page = lazy(() => import('./Pages/Contact_page'));
const Faq_page = lazy(() => import('./Pages/Faq_page'));
const NotFoundPage = lazy(() => import('./Pages/NotFoundPage'));
const BlogPage = lazy(() => import('./Pages/BlogPage'));
const BlogArticlePage = lazy(() => import('./Pages/BlogArticlePage'));
const SearchPage = lazy(() => import('./Pages/SearchPage'));
const ToolsDirectoryPage = lazy(() => import('./Pages/ToolsDirectoryPage'));
const FileGuideRedirect = lazy(() => import('./Pages/FileGuideRedirect'));

const PageFallback = () => (
  <div className="min-h-screen bg-[#f8f6f0]" aria-label="Loading page" />
);

function App() {
  return (
      <BrowserRouter>
      <AnalyticsTracker />
      <CanonicalRedirect />
      <SeoManager />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="tools" element={<ToolsDirectoryPage />} />
          <Route path="tools/pdf-to-word" element={<Pdf_converter_page />} />
          <Route path="tools/word-to-pdf" element={<Word_converter_page />} />
          <Route path="tools/compress-pdf" element={<Compress_pdf_page />} />
          <Route path="tools/merge-pdf" element={<Merge_pdf_page />} />
          <Route path="tools/split-pdf" element={<Split_pdf_page />} />
          <Route path="tools/sign-pdf" element={<Sign_pdf_page />} />
          <Route path="tools/edit-pdf" element={<Edit_pdf_page />} />
          <Route path="tools/pptx-to-pdf" element={<Pptx_to_pdf_page />} />
          <Route path="tools/xlsx-to-csv" element={<Xlsx_to_csv_page />} />
          <Route path="tools/excel-to-pdf" element={<Excel_pdf_page />} />
          <Route path="tools/unlock-pdf" element={<Unlock_pdf_page />} />
          <Route path="tools/protect-pdf" element={<Protect_pdf_page />} />
          <Route path="pdf-to-word" element={<Navigate to="/tools/pdf-to-word" replace />} />
          <Route path="word-to-pdf" element={<Navigate to="/tools/word-to-pdf" replace />} />
          <Route path="compress-pdf" element={<Navigate to="/tools/compress-pdf" replace />} />
          <Route path="merge-pdf" element={<Navigate to="/tools/merge-pdf" replace />} />
          <Route path="split-pdf" element={<Navigate to="/tools/split-pdf" replace />} />
          <Route path="sign-pdf" element={<Navigate to="/tools/sign-pdf" replace />} />
          <Route path="edit-pdf" element={<Navigate to="/tools/edit-pdf" replace />} />
          <Route path="pptx-to-pdf" element={<Navigate to="/tools/pptx-to-pdf" replace />} />
          <Route path="xlsx-to-csv" element={<Navigate to="/tools/xlsx-to-csv" replace />} />
          <Route path="excel-to-pdf" element={<Navigate to="/tools/excel-to-pdf" replace />} />
          <Route path="unlock-pdf" element={<Navigate to="/tools/unlock-pdf" replace />} />
          <Route path="protect-pdf" element={<Navigate to="/tools/protect-pdf" replace />} />
          <Route path="privacy" element={<Privacy_policypage />} />
          <Route path="terms-and-conditions" element={<Termsconditionpage />} />
          <Route path="terms&conditions" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="about" element={<About_page />} />
          <Route path="contact" element={<Contact_page />} />
          <Route path="faq" element={<Faq_page />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="files" element={<Navigate to="/blog" replace />} />
          <Route path="blog/how-to-open-heic" element={<Navigate to="/blog/what-is-a-heic-file" replace />} />
          <Route path="blog/:slug" element={<BlogArticlePage />} />
          <Route path="files/:fileSlug" element={<FileGuideRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
