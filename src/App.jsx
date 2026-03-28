import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";
import CataloguePage from "./pages/CataloguePage";
import WatchListPage from "./pages/WatchListPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ——— Routes sans navbar ———
const AUTH_ROUTES = ['/login', '/register'];

function PageWrapper({ children }) {
  return (
    <div className="page-transition">
      {children}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  // Supprime le loader global au premier rendu
  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 400);
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-dm">

      {/* Navbar cachée sur login/register */}
      {!isAuthPage && <Navbar />}

      {/* Toast global */}
      <Toast />

      <Routes>
        <Route path="/"          element={<Navigate to="/login" />} />
        <Route path="/login"     element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register"  element={<PageWrapper><RegisterPage /></PageWrapper>} />

        {/* Routes protégées */}
        <Route path="/home"      element={<PrivateRoute><PageWrapper><HomePage /></PageWrapper></PrivateRoute>} />
        <Route path="/catalogue" element={<PrivateRoute><PageWrapper><CataloguePage /></PageWrapper></PrivateRoute>} />
        <Route path="/watchlist" element={<PrivateRoute><PageWrapper><WatchListPage /></PageWrapper></PrivateRoute>} />
        <Route path="/about"     element={<PrivateRoute><PageWrapper><AboutPage /></PageWrapper></PrivateRoute>} />
        <Route path="/player/:id" element={<PrivateRoute><PageWrapper><PlayerPage /></PageWrapper></PrivateRoute>} />

        <Route path="*"          element={<Navigate to="/login" />} />
      </Routes>

      {/* Footer caché sur login/register */}
      {!isAuthPage && (
        <footer className="text-center py-6">
          <p className="text-xs tracking-widest" style={{ color: "#444" }}>

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
