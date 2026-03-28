import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { videos, categoriesData } from '../data/mockData';
import VideoCard from '../components/VideoCard';
import SearchFilters from '../components/SearchFilters';
import { filterVideos } from '../utils/filterVideos';
import { SearchIcon, CloseIcon } from '../components/Icons';
import SkeletonCard from '../components/SkeletonCard';

const CI_O = '#FF8C00';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';
const CARD = '#1A1A22';

export default function CataloguePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    genre: 'Tous', year: 'Toutes', rating: 'Tous',
  });

  // ——— Reset quand la catégorie change ———
  useEffect(() => {
    setSearchQuery('');
    setActiveFilters({ genre: 'Tous', year: 'Toutes', rating: 'Tous' });
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryParam]);

  // ——— Catégorie active ———
  const activeCategory = categoryParam
    ? categoriesData.find(c => c.id === categoryParam)
    : null;

  // ——— Filtre par catégorie si param présent ———
  const baseVideos = categoryParam
    ? videos.filter(v => v.category === categoryParam)
    : videos;

  const filtered = filterVideos(baseVideos, searchQuery, activeFilters);

  return (
    <div className="page-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px' }}>

      {/* ——— Header ——— */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: TEXT_P,
          margin: '0 0 4px', letterSpacing: -1,
        }}>
          {activeCategory
            ? `${activeCategory.icon} ${activeCategory.name}`
            : 'Catalogue'
          }
        </h1>
        <p style={{ fontSize: 14, color: TEXT_S, margin: '0 0 24px' }}>
          {filtered.length} vidéo{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          {baseVideos.length !== filtered.length && (
            <span style={{ color: TEXT_DIM }}> sur {baseVideos.length}</span>
          )}
          {/* ——— Lien retour catalogue complet ——— */}
          {activeCategory && (
            <span
              onClick={() => navigate('/catalogue')}
              style={{
                marginLeft: 12, fontSize: 11, color: CI_O,
                cursor: 'pointer', textDecoration: 'underline',
              }}>
              ← Voir tout le catalogue
            </span>
          )}
        </p>
      </div>

      {/* ——— Barre de recherche ——— */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#1A1A22', borderRadius: 12,
        border: '1px solid #2A2A35', padding: '10px 16px',
        marginBottom: 16,
      }}>
        <SearchIcon size={16} color={TEXT_DIM} />
        <input
          type="text"
          placeholder={activeCategory
            ? `Rechercher dans ${activeCategory.name}...`
            : 'Rechercher un titre, réalisateur, acteur...'
          }
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
              padding: 0, display: 'flex',
            }}><CloseIcon size={16} color={TEXT_DIM} /></button>
        )}
      </div>

      {/* ——— Filtres avancés ——— */}
      <SearchFilters onFilterChange={setActiveFilters} />

      {/* ——— Skeleton loading ——— */}
      {isLoading ? (
        <div className="video-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          borderRadius: 16, background: CARD,
          border: `1px solid ${BORDER}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <SearchIcon size={48} color={TEXT_DIM} />
          </div>
          <p style={{ fontSize: 15, color: TEXT_S, margin: '0 0 8px', fontWeight: 600 }}>
            Aucun résultat trouvé
          </p>
          <p style={{ fontSize: 13, color: TEXT_DIM, margin: 0 }}>
            Essaie d'autres termes ou modifie les filtres
          </p>
        </div>
      ) : (
        <div className="video-grid" style={{
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