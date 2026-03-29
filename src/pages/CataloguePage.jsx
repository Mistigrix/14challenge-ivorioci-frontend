import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import VideoCard from '../components/VideoCard';
import SearchFilters from '../components/SearchFilters';
import { filterVideos } from '../utils/filterVideos';
import { SearchIcon, CloseIcon } from '../components/Icons';
import SkeletonCard from '../components/SkeletonCard';
import { catalogueService } from '../services/api';

const CI_O = '#FF8C00';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777777';
const TEXT_DIM = '#444444';
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

  // ——— Store et API ———
  const { videos: storeVideos, loadVideos } = useVideoStore();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [allVideos, setAllVideos] = useState([]);

  // ——— Charge les catégories et vidéos au montage ———
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log('[CataloguePage] Chargement initial...');
        
        // 1. Charger les catégories
        const categoriesRes = await catalogueService.getCategories();
        if (categoriesRes?.data?.success && categoriesRes.data.data) {
          setCategories(categoriesRes.data.data);
          console.log('[CataloguePage] ✅ Catégories chargées:', categoriesRes.data.data.length);
        }
        
        // 2. Charger les vidéos si pas déjà fait
        let videos = storeVideos;
        if (!videos || videos.length === 0) {
          console.log('[CataloguePage] Chargement des vidéos...');
          await loadVideos();
          videos = useVideoStore.getState().videos;
        }
        
        console.log('[CataloguePage] Vidéos disponibles:', videos?.length || 0);
        setAllVideos(videos || []);
        
      } catch (err) {
        console.error('[CataloguePage] ❌ Erreur chargement:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [loadVideos, storeVideos]);

  // ——— Filtre les vidéos par catégorie active ———
  useEffect(() => {
    if (categoryParam && allVideos.length > 0) {
      console.log(`[CataloguePage] Filtrage par catégorie: ${categoryParam}`);
      
      // Trouver la catégorie correspondante
      const category = categories.find(c => c.id === categoryParam);
      if (category) {
        setActiveCategory(category);
        console.log('[CataloguePage] Catégorie active:', category.name);
      } else {
        setActiveCategory(null);
      }
    } else {
      setActiveCategory(null);
    }
  }, [categoryParam, categories, allVideos]);

  // ——— Filtrer les vidéos selon la catégorie active et la recherche ———
  const getFilteredVideos = () => {
    let baseVideos = allVideos;
    
    // Filtrer par catégorie si active
    if (activeCategory) {
      baseVideos = allVideos.filter(v => v.categoryId === activeCategory.id);
      console.log(`[CataloguePage] Vidéos dans ${activeCategory.name}: ${baseVideos.length}`);
    }
    
    // Appliquer les filtres de recherche
    return filterVideos(baseVideos, searchQuery, activeFilters);
  };
  
  const filtered = getFilteredVideos();

  return (
    <div className="page-container" style={{
      maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px',
    }}>

      {/* ——— Header ——— */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: TEXT_P,
          margin: '0 0 4px', letterSpacing: -1,
        }}>
          {activeCategory
            ? activeCategory.name
            : 'Catalogue'
          }
        </h1>
        {activeCategory && (
          <p style={{ fontSize: 13, color: TEXT_S, margin: '0 0 8px' }}>
            {activeCategory.description}
          </p>
        )}
        <p style={{ fontSize: 14, color: TEXT_S, margin: '0 0 24px' }}>
          {filtered.length} vidéo{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          {!activeCategory && allVideos.length !== filtered.length && (
            <span style={{ color: TEXT_DIM }}> sur {allVideos.length}</span>
          )}
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

      {/* ——— Filtres catégories depuis API ——— */}
      {categories.length > 0 && (
        <div style={{
          display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap',
        }}>
          <button
            onClick={() => navigate('/catalogue')}
            style={{
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
              border: !activeCategory ? 'none' : `1px solid ${BORDER}`,
              background: !activeCategory ? `${CI_O}20` : 'transparent',
              color: !activeCategory ? CI_O : TEXT_S,
              fontSize: 12, fontWeight: !activeCategory ? 700 : 400,
              transition: 'all 0.2s',
            }}>
            Tous
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/catalogue?category=${cat.id}`)}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                border: activeCategory?.id === cat.id ? 'none' : `1px solid ${BORDER}`,
                background: activeCategory?.id === cat.id ? `${CI_O}20` : 'transparent',
                color: activeCategory?.id === cat.id ? CI_O : TEXT_S,
                fontSize: 12, fontWeight: activeCategory?.id === cat.id ? 700 : 400,
                transition: 'all 0.2s',
              }}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ——— Barre de recherche ——— */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: CARD, borderRadius: 12,
        border: `1px solid ${BORDER}`, padding: '10px 16px',
        marginBottom: 16,
      }}>
        <SearchIcon size={16} color={TEXT_DIM} />
        <input
          type="text"
          placeholder={activeCategory
            ? `Rechercher dans ${activeCategory.name}...`
            : 'Rechercher un titre...'
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
            }}>
            <CloseIcon size={16} color={TEXT_DIM} />
          </button>
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
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
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
          {filtered.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}

    </div>
  );
}