import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { profiles } from '../data/mockData';
import SearchBar from './SearchBar';
import { MenuIcon, CloseIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const CARD_HOVER = '#22222C';
const SURFACE = '#131318';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';

const FlagBar = () => (
  <div style={{ display: 'flex', width: 32, height: 3, borderRadius: 2, overflow: 'hidden' }}>
    <div style={{ flex: 1, background: CI_O }} />
    <div style={{ flex: 1, background: '#FFF' }} />
    <div style={{ flex: 1, background: CI_G }} />
  </div>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentProfile, setCurrentProfile] = useState(profiles[0]);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/home',      label: 'Accueil'   },
    { path: '/catalogue', label: 'Catalogue' },
    { path: '/watchlist', label: 'Ma liste'  },
    { path: '/about',     label: 'À propos'  },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 16px', height: 56,
        background: 'rgba(10,10,14,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', height: '100%', position: 'relative',
        }}>

          {/* ——— Logo (gauche) ——— */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => navigate('/home')}>
            <FlagBar />
            <span style={{
              fontSize: 18, fontWeight: 800, color: TEXT_P, letterSpacing: -0.5,
            }}>
              Ivorio<span style={{ color: CI_O }}>CI</span>
            </span>
          </div>

          {/* ——— Nav links centré ——— */}
          <div
            className="nav-links-desktop"
            style={{
              display: 'flex', gap: 24, alignItems: 'center',
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            }}>
            {navLinks.map(n => (
              <Link key={n.path} to={n.path}
                style={{
                  fontSize: 12,
                  fontWeight: location.pathname === n.path ? 700 : 400,
                  color: location.pathname === n.path ? CI_O : TEXT_S,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                {n.label}
              </Link>
            ))}
          </div>

          {/* ——— Droite ——— */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* ——— SearchBar toujours visible ——— */}
            <SearchBar />

            {/* ——— Toggle theme sombre/clair ——— */}
            <ThemeToggle />

            {/* ——— Profil ——— */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfilePicker(!showProfilePicker)}
                style={{
                  width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
                  background: `linear-gradient(135deg, ${CI_O}, ${CI_G})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFF', fontSize: 12, fontWeight: 700,
                  border: `2px solid ${showProfilePicker ? CI_O : 'transparent'}`,
                  transition: 'all 0.2s',
                }}>
                {currentProfile.avatar}
              </div>

              {/* Dropdown profils */}
              {showProfilePicker && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: CARD, borderRadius: 14,
                  border: `1px solid ${BORDER}`,
                  padding: 12, minWidth: 180,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  zIndex: 9999,
                }}>
                  <p style={{
                    fontSize: 10, color: TEXT_DIM, margin: '0 0 8px',
                    textTransform: 'uppercase', letterSpacing: 1,
                  }}>Profils</p>
                  {profiles.map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setCurrentProfile(p); setShowProfilePicker(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                        background: currentProfile.id === p.id ? `${CI_O}15` : 'transparent',
                        transition: 'all 0.2s', marginBottom: 2,
                      }}
                      onMouseEnter={e => {
                        if (currentProfile.id !== p.id)
                          e.currentTarget.style.background = CARD_HOVER;
                      }}
                      onMouseLeave={e => {
                        if (currentProfile.id !== p.id)
                          e.currentTarget.style.background = 'transparent';
                      }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: currentProfile.id === p.id
                          ? `linear-gradient(135deg, ${CI_O}, ${CI_G})`
                          : SURFACE,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: currentProfile.id === p.id ? '#FFF' : TEXT_S,
                        fontSize: 10, fontWeight: 700,
                      }}>{p.avatar}</div>
                      <div>
                        <p style={{
                          fontSize: 12, fontWeight: 600, color: TEXT_P, margin: 0,
                        }}>{p.name}</p>
                        {p.isKid && (
                          <span style={{ fontSize: 9, color: CI_G }}>Enfant</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ——— Hamburger mobile ——— */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hamburger-btn"
              style={{
                display: 'none',
                background: 'none',
                border: `1px solid ${BORDER}`,
                color: TEXT_P, width: 34, height: 34,
                borderRadius: 8, cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
              }}>
              {menuOpen ? <CloseIcon size={18} color={TEXT_P} /> : <MenuIcon size={18} color={TEXT_P} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ——— Menu mobile (sans SearchBar) ——— */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 999,
          background: 'rgba(10,10,14,0.98)',
          borderBottom: `1px solid ${BORDER}`,
          padding: '12px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map(n => (
            <Link
              key={n.path}
              to={n.path}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 8px', fontSize: 14, fontWeight: 500,
                color: location.pathname === n.path ? CI_O : TEXT_S,
                textDecoration: 'none', borderRadius: 8,
                background: location.pathname === n.path ? `${CI_O}08` : 'transparent',
              }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
