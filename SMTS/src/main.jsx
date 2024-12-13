import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./UserPages/MainPage.jsx";
import LoginPage from "./UserPages/LoginPage.jsx";
import RegisterPage from "./UserPages/RegisterPage.jsx";
import DetailPage from "./UserPages/DetailPage.jsx";
import AddPage from "./UserPages/AddPage.jsx";
import FavoritesPage from "./UserPages/FavoritesPage.jsx";
import AdminAddPage from "./AdminPage/AdminAddPage.jsx";
import AdminDetailPage from "./AdminPage/AdminDetailPage.jsx";
import AdminFavoritesPage from "./AdminPage/AdminFavoritesPage.jsx";
import AdminMainPage from "./AdminPage/AdminMainPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/Admin/" element={<AdminMainPage />} />
        <Route path="/Admin/detail/:id" element={<AdminDetailPage />} />
        <Route path="/Admin/add" element={<AdminAddPage />} />
        <Route path="/Admin/favorites" element={<AdminFavoritesPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
