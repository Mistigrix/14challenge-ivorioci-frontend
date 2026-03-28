import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { fmtDuration, getCoverGradient } from './VideoCard';
import { SearchIcon, CloseIcon, ClockIcon, PlayIcon, ArrowRightIcon } from './Icons';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const CARD = '#1A1A22';
const CARD_HOVER = '#22222C';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';

export default function SearchBar() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const {
    query, setQuery,
    results, suggestions,
    recentSearches,
    isOpen, setIsOpen,
    applySearch, submitSearch,
    removeRecentSearch, clearRecentSearches,
  } = useSearch();

  // ——— Ferme en cliquant dehors ———
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitSearch();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const goToVideo = (videoId) => {
    submitSearch();
    navigate(`/player/${videoId}`);
    setIsOpen(false);
  };

  const showDropdown = isOpen && (
    query.length === 0
      ? recentSearches.length > 0
      : results.length > 0 || suggestions.length > 0
  );

  return (
    <div style={{ position: 'relative' }}>

      {/* ——— Input ——— */}
      <div className="search-input-wrapper" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: CARD, borderRadius: 10,
        border: `1px solid ${isOpen ? CI_O : BORDER}`,
        padding: '6px 12px', width: 220,
        transition: 'border 0.2s',
      }}>
        <SearchIcon size={14} color={TEXT_DIM} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1, background: 'none', border: 'none',
            outline: 'none', color: TEXT_P, fontSize: 12,
            minWidth: 0,
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(true); inputRef.current?.focus(); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: TEXT_DIM, padding: 0, display: 'flex',
            }}>
            <CloseIcon size={14} color={TEXT_DIM} />
          </button>
        )}
      </div>

      {/* ——— Dropdown ——— */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="search-dropdown"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 380, background: CARD,
            borderRadius: 14, border: `1px solid ${BORDER}`,
            padding: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            maxHeight: 480, overflowY: 'auto', zIndex: 9999,
          }}>

          {/* ——— Recherches recentes ——— */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 8,
              }}>
                <p style={{
                  fontSize: 10, color: TEXT_DIM, margin: 0,
                  textTransform: 'uppercase', letterSpacing: 1.5,
                }}>Recherches récentes</p>
                <button
                  onClick={clearRecentSearches}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 10, color: TEXT_DIM, textDecoration: 'underline',
                  }}>Tout effacer</button>
              </div>
              {recentSearches.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = CARD_HOVER}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <ClockIcon size={14} color={TEXT_DIM} />
                  <span
                    onClick={() => applySearch(s)}
                    style={{
                      flex: 1, fontSize: 12, color: TEXT_S,
                    }}>{s}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeRecentSearch(s); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: TEXT_DIM, padding: 0, display: 'flex',
                    }}>
                    <CloseIcon size={12} color={TEXT_DIM} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ——— Suggestions ——— */}
          {query.length > 0 && suggestions.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{
                fontSize: 10, color: TEXT_DIM, margin: '0 0 8px',
                textTransform: 'uppercase', letterSpacing: 1.5,
              }}>Suggestions</p>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => applySearch(s.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = CARD_HOVER}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <SearchIcon size={13} color={TEXT_DIM} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT_P }}>
                      {s.label.toLowerCase().includes(query.toLowerCase()) ? (
                        <>
                          {s.label.substring(0, s.label.toLowerCase().indexOf(query.toLowerCase()))}
                          <span style={{ color: CI_O, fontWeight: 700 }}>
                            {s.label.substring(
                              s.label.toLowerCase().indexOf(query.toLowerCase()),
                              s.label.toLowerCase().indexOf(query.toLowerCase()) + query.length
                            )}
                          </span>
                          {s.label.substring(
                            s.label.toLowerCase().indexOf(query.toLowerCase()) + query.length
                          )}
                        </>
                      ) : s.label}
                    </span>
                    <span style={{
                      fontSize: 9, color: TEXT_DIM, marginLeft: 6,
                      textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>{s.type === 'title' ? 'Film' : s.type === 'genre' ? 'Genre' : s.type === 'director' ? 'Réalisateur' : 'Acteur'}</span>
                  </div>
                  <ArrowRightIcon size={12} color={TEXT_DIM} />
                </div>
              ))}
            </div>
          )}

          {/* ——— Resultats videos ——— */}
          {query.length >= 2 && results.length > 0 && (
            <div>
              <p style={{
                fontSize: 10, color: TEXT_DIM, margin: '0 0 8px',
                textTransform: 'uppercase', letterSpacing: 1.5,
              }}>
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </p>
              {results.map(v => (
                <div
                  key={v.id}
                  onClick={() => goToVideo(v.id)}
                  style={{
                    display: 'flex', gap: 12, padding: '8px 10px',
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = CARD_HOVER}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {/* Miniature */}
                  <div style={{
                    width: 80, height: 45, borderRadius: 8, flexShrink: 0,
                    background: getCoverGradient(v.title),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <PlayIcon size={16} color="rgba(255,255,255,0.8)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 12, fontWeight: 600, color: TEXT_P,
                      margin: '0 0 2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{v.title}</p>
                    <p style={{ fontSize: 10, color: TEXT_S, margin: 0 }}>
                      {v.genres.join(' · ')} — {fmtDuration(v.duration)}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 9, padding: '2px 6px', borderRadius: 4,
                    background: v.rating === '16+' ? 'rgba(229,57,53,0.15)'
                      : v.rating === '12+' ? `${CI_O}15` : `${CI_G}15`,
                    color: v.rating === '16+' ? '#E53935'
                      : v.rating === '12+' ? CI_O : CI_G,
                    alignSelf: 'center', fontWeight: 600,
                  }}>{v.rating}</span>
                </div>
              ))}
            </div>
          )}

          {/* ——— Aucun resultat ——— */}
          {query.length >= 2 && results.length === 0 && suggestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <SearchIcon size={32} color={TEXT_DIM} />
              </div>
              <p style={{ fontSize: 12, color: TEXT_S, margin: 0 }}>
                Aucun résultat pour "<span style={{ color: CI_O }}>{query}</span>"
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
