import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import CataloguePage from './pages/CataloguePage';
import WatchListPage from './pages/WatchListPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-bg text-[#F0EDE6] font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/player/:id" element={<PlayerPage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/watchlist" element={<WatchListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        <footer className="text-center py-6">
          <p className="text-[10px] text-[#444] tracking-widest">
            CHALLENGE 14-14-14 // JOUR 13 // MARS 2026
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}