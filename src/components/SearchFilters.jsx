import { useState } from 'react';
import { videos } from '../data/mockData';
import { FilterIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon } from './Icons';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';
const INPUT_BG = '#111116';

// ——— Données dynamiques depuis les vidéos ———
const allGenres = ['Tous', ...new Set(videos.flatMap(v => v.genres))];
const allYears = ['Toutes', ...new Set(videos.map(v => v.releaseDate)).values()].sort().reverse();
const allRatings = ['Tous', 'Tout public', '12+', '16+'];

export default function SearchFilters({ onFilterChange }) {
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [selectedRating, setSelectedRating] = useState('Tous');
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    selectedGenre !== 'Tous' ||
    selectedYear !== 'Toutes' ||
    selectedRating !== 'Tous';

  const applyFilters = (genre, year, rating) => {
    onFilterChange({ genre, year, rating });
  };

  const handleGenre = (g) => {
    setSelectedGenre(g);
    applyFilters(g, selectedYear, selectedRating);
  };

  const handleYear = (y) => {
    setSelectedYear(y);
    applyFilters(selectedGenre, y, selectedRating);
  };

  const handleRating = (r) => {
    setSelectedRating(r);
    applyFilters(selectedGenre, selectedYear, r);
  };

  const resetFilters = () => {
    setSelectedGenre('Tous');
    setSelectedYear('Toutes');
    setSelectedRating('Tous');
    applyFilters('Tous', 'Toutes', 'Tous');
  };

  return (
    <div style={{ marginBottom: 24 }}>

      {/* ——— Bouton toggle filtres ——— */}
      <div className="filter-tags" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
            border: `1px solid ${hasActiveFilters ? CI_O : BORDER}`,
            background: hasActiveFilters ? `${CI_O}12` : 'transparent',
            color: hasActiveFilters ? CI_O : TEXT_S,
            fontSize: 12, fontWeight: 500, transition: 'all 0.2s',
          }}>
          <FilterIcon size={14} color={hasActiveFilters ? CI_O : TEXT_S} />
          Filtres
          {hasActiveFilters && (
            <span style={{
              background: CI_O, color: '#FFF',
              borderRadius: '50%', width: 16, height: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
            }}>
              {[selectedGenre !== 'Tous', selectedYear !== 'Toutes', selectedRating !== 'Tous']
                .filter(Boolean).length}
            </span>
          )}
          {isOpen ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
        </button>

        {/* Tags filtres actifs */}
        {selectedGenre !== 'Tous' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 20,
            background: `${CI_O}15`, border: `1px solid ${CI_O}40`,
            fontSize: 11, color: CI_O,
          }}>
            {selectedGenre}
            <button
              onClick={() => handleGenre('Tous')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, lineHeight: 1, display: 'flex',
              }}><CloseIcon size={12} color={CI_O} /></button>
          </div>
        )}
        {selectedYear !== 'Toutes' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 20,
            background: `${CI_G}15`, border: `1px solid ${CI_G}40`,
            fontSize: 11, color: CI_G,
          }}>
            {selectedYear}
            <button
              onClick={() => handleYear('Toutes')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, lineHeight: 1, display: 'flex',
              }}><CloseIcon size={12} color={CI_G} /></button>
          </div>
        )}
        {selectedRating !== 'Tous' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 20,
            background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)',
            fontSize: 11, color: '#E53935',
          }}>
            {selectedRating}
            <button
              onClick={() => handleRating('Tous')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, lineHeight: 1, display: 'flex',
              }}><CloseIcon size={12} color="#E53935" /></button>
          </div>
        )}

        {/* Reset tout */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: TEXT_DIM, textDecoration: 'underline',
            }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* ——— Panel filtres ——— */}
      {isOpen && (
        <div style={{
          background: CARD, borderRadius: 16,
          border: `1px solid ${BORDER}`, padding: 24,
          marginBottom: 16, transition: 'all 0.3s',
        }}>
          <div className="filters-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 24,
          }}>

            {/* Genre */}
            <div>
              <p style={{
                fontSize: 10, color: TEXT_DIM, margin: '0 0 12px',
                textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 500,
              }}>Genre</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {allGenres.map(g => (
                  <button key={g}
                    onClick={() => handleGenre(g)}
                    style={{
                      padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
                      border: selectedGenre === g ? 'none' : `1px solid ${BORDER}`,
                      background: selectedGenre === g ? `${CI_O}20` : 'transparent',
                      color: selectedGenre === g ? CI_O : TEXT_S,
                      fontSize: 11, fontWeight: selectedGenre === g ? 700 : 400,
                      transition: 'all 0.2s',
                    }}>{g}</button>
                ))}
              </div>
            </div>

            {/* Année */}
            <div>
              <p style={{
                fontSize: 10, color: TEXT_DIM, margin: '0 0 12px',
                textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 500,
              }}>Année</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {allYears.map(y => (
                  <button key={y}
                    onClick={() => handleYear(y)}
                    style={{
                      padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
                      border: selectedYear === y ? 'none' : `1px solid ${BORDER}`,
                      background: selectedYear === y ? `${CI_G}20` : 'transparent',
                      color: selectedYear === y ? CI_G : TEXT_S,
                      fontSize: 11, fontWeight: selectedYear === y ? 700 : 400,
                      transition: 'all 0.2s',
                    }}>{y}</button>
                ))}
              </div>
            </div>

            {/* Classification */}
            <div>
              <p style={{
                fontSize: 10, color: TEXT_DIM, margin: '0 0 12px',
                textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 500,
              }}>Classification</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {allRatings.map(r => (
                  <button key={r}
                    onClick={() => handleRating(r)}
                    style={{
                      padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
                      border: selectedRating === r ? 'none' : `1px solid ${BORDER}`,
                      background: selectedRating === r
                        ? r === 'Tout public' ? `${CI_G}20`
                        : r === '12+' ? `${CI_O}20`
                        : 'rgba(229,57,53,0.15)'
                        : 'transparent',
                      color: selectedRating === r
                        ? r === 'Tout public' ? CI_G
                        : r === '12+' ? CI_O
                        : '#E53935'
                        : TEXT_S,
                      fontSize: 11, fontWeight: selectedRating === r ? 700 : 400,
                      transition: 'all 0.2s',
                    }}>{r}</button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}