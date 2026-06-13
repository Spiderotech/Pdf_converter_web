import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import Homepage from "./Pages/Homepage";
import Loginpage from "./Pages/Loginpage";
import Registerpage from "./Pages/Registerpage";
import Word_converter_page from "./Pages/Word_converter_page";
import Pdf_converter_page from "./Pages/Pdf_converter_page";
import Accountpage from "./Pages/Accountpage";
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

type RootState = {
  user: {
    value: {
      id: string | null;
      name: string | null;
      email: string | null;
      access_token: string | null;
    };
  };
};

function App() {

  const userdata = useSelector((state: RootState) => state.user.value);
  console.log(userdata);

  const isAuthenticated = Boolean(userdata?.access_token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/" /> : <Loginpage />}
        />
        <Route
          path="register"
          element={isAuthenticated ? <Navigate to="/" /> : <Registerpage />}
        />
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
        <Route path="terms&conditions" element={<Termsconditionpage />} />
        <Route
          path="account"
          element={
            isAuthenticated ? <Accountpage /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
