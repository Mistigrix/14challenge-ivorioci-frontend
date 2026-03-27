import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import { profiles } from '../data/mockData';

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
  const { videos } = useVideoStore();

  const [currentProfile, setCurrentProfile] = useState(profiles[0]);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/',          label: 'Accueil'   },
    { path: '/catalogue', label: 'Catalogue' },
    { path: '/watchlist', label: 'Ma liste'  },
    { path: '/about',     label: 'À propos'  },
  ];

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setSearchResults(
        videos.filter(v =>
          v.title.toLowerCase().includes(q.toLowerCase()) ||
          v.description.toLowerCase().includes(q.toLowerCase()) ||
          v.genres.some(g => g.toLowerCase().includes(q.toLowerCase()))
        )
      );
    } else {
      setSearchResults([]);
    }
  };

  const getCoverGradient = (title) => {
    const hash = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const hue1 = hash % 360;
    const hue2 = (hue1 + 45) % 360;
    return `linear-gradient(145deg, hsl(${hue1},60%,25%), hsl(${hue2},50%,18%))`;
  };

  const fmtDuration = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m}min`;
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 32px', height: 56,
        background: 'rgba(10,10,14,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', height: '100%',
        }}>

          {/* ——— Logo ——— */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              onClick={() => navigate('/')}>
              <FlagBar />
              <span style={{
                fontSize: 18, fontWeight: 800, color: TEXT_P, letterSpacing: -0.5,
              }}>
                Ivorio<span style={{ color: CI_O }}>CI</span>
              </span>
            </div>

            {/* ——— Nav links desktop ——— */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}
              className="nav-links-desktop">
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
          </div>

          {/* ——— Droite ——— */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* Recherche */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: CARD, borderRadius: 10,
              border: `1px solid ${BORDER}`,
              padding: '6px 12px', width: 220,
            }}>
              <span style={{ fontSize: 13, color: TEXT_DIM }}>🔍</span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  flex: 1, background: 'none', border: 'none',
                  outline: 'none', color: TEXT_P, fontSize: 12,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: TEXT_DIM, fontSize: 14, padding: 0,
                  }}>✕</button>
              )}
            </div>

            {/* Profil */}
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
                        <p style={{ fontSize: 12, fontWeight: 600, color: TEXT_P, margin: 0 }}>
                          {p.name}
                        </p>
                        {p.isKid && (
                          <span style={{ fontSize: 9, color: CI_G }}>👶 Enfant</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hamburger-btn"
              style={{
                display: 'none',
                background: 'none',
                border: `1px solid ${BORDER}`,
                color: TEXT_P, width: 34, height: 34,
                borderRadius: 8, fontSize: 16, cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
              }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* ——— Résultats recherche ——— */}
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: 56, right: 80, width: 380,
            background: CARD, borderRadius: 14,
            border: `1px solid ${BORDER}`,
            padding: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            maxHeight: 400, overflowY: 'auto',
          }}>
            <p style={{ fontSize: 10, color: TEXT_DIM, margin: '0 0 8px' }}>
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
            </p>
            {searchResults.map(v => (
              <div
                key={v.id}
                onClick={() => {
                  navigate(`/player/${v.id}`);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                style={{
                  display: 'flex', gap: 12, padding: '8px 10px',
                  borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = CARD_HOVER}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{
                  width: 80, height: 45, borderRadius: 8, flexShrink: 0,
                  background: getCoverGradient(v.title),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700,
                }}>▶</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: TEXT_P, margin: '0 0 2px' }}>
                    {v.title}
                  </p>
                  <p style={{ fontSize: 10, color: TEXT_S, margin: 0 }}>
                    {v.genres.join(' · ')} — {fmtDuration(v.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ——— Menu mobile ——— */}
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

      {/* ——— Style responsive ——— */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}