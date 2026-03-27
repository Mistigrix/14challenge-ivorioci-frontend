import { useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { videos } from '../data/mockData';
import VideoCard from '../components/VideoCard';
import SearchFilters from '../components/SearchFilters';
import { filterVideos } from '../utils/filterVideos';

const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';

export default function CataloguePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    genre: 'Tous', year: 'Toutes', rating: 'Tous',
  });

  const filtered = filterVideos(videos, searchQuery, activeFilters);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px' }}>

      {/* ——— Header ——— */}
      <h1 style={{
        fontSize: 32, fontWeight: 800, color: TEXT_P,
        margin: '0 0 8px', letterSpacing: -1,
      }}>Catalogue</h1>
      <p style={{ fontSize: 14, color: TEXT_S, margin: '0 0 24px' }}>
        {filtered.length} vidéo{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
        {videos.length !== filtered.length && (
          <span style={{ color: TEXT_DIM }}> sur {videos.length}</span>
        )}
      </p>

      {/* ——— Barre de recherche ——— */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#1A1A22', borderRadius: 12,
        border: '1px solid #2A2A35', padding: '10px 16px',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 16, color: TEXT_DIM }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher un titre, réalisateur, acteur..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1, background: 'none', border: 'none',
            outline: 'none', color: TEXT_P, fontSize: 13,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: TEXT_DIM, fontSize: 16,
            }}>✕</button>
        )}
      </div>

      {/* ——— Filtres avancés ——— */}
      <SearchFilters onFilterChange={setActiveFilters} />

      {/* ——— Résultats vides ——— */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          borderRadius: 16, background: CARD,
          border: `1px solid ${BORDER}`,
        }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🔍</span>
          <p style={{ fontSize: 15, color: TEXT_S, margin: '0 0 8px', fontWeight: 600 }}>
            Aucun résultat trouvé
          </p>
          <p style={{ fontSize: 13, color: TEXT_DIM, margin: 0 }}>
            Essaie d'autres termes ou modifie les filtres
          </p>
        </div>
      ) : (
        /* ——— Grille ——— */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(v => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}

    </div>
  );
}
