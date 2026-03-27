import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";
import CataloguePage from "./pages/CataloguePage";
import WatchListPage from "./pages/WatchListPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ——— Routes sans navbar ———
const AUTH_ROUTES = ['/login', '/register'];

function AppContent() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-dm">

      {/* Navbar cachée sur login/register */}
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/"          element={<Navigate to="/login" />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/home"      element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/watchlist" element={<WatchListPage />} />
        <Route path="/about"     element={<AboutPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="*"          element={<Navigate to="/login" />} />
      </Routes>

      {/* Footer caché sur login/register */}
      {!isAuthPage && (
        <footer className="text-center py-6">
          <p className="text-xs tracking-widest" style={{ color: "#444" }}>
            CHALLENGE 14-14-14 // JOUR 13 // MARS 2026
          </p>
        </footer>
      )}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}