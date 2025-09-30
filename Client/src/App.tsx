import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Homepage from "./Pages/Homepage";
import Loginpage from "./Pages/Loginpage";
import Registerpage from "./Pages/Registerpage";
import Word_converter_page from "./Pages/Word_converter_page";
import Pdf_converter_page from "./Pages/Pdf_converter_page";
import Accountpage from "./Pages/Accountpage";
import Privacy_policypage from './Pages/Privacy_policypage';
import Termsconditionpage from './Pages/Termsconditionpage';

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
