import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./UserPages/MainPage.jsx";
import LoginPage from "./UserPages/LoginPage.jsx";
import RegisterPage from "./UserPages/RegisterPage.jsx";
import DetailPage from "./UserPages/DetailPage.jsx";
import AddPage from "./UserPages/AddPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/add" element={<AddPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
