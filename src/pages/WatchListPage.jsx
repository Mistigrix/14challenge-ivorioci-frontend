// pages/WatchListPage.jsx
import { useEffect, useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import VideoCard from '../components/VideoCard';
import SkeletonCard from '../components/SkeletonCard';

const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';

export default function WatchListPage() {
  const { watchList, videos, loadVideos } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [listVideos, setListVideos] = useState([]);

  // ——— Charger les vidéos si nécessaire ———
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      // Si pas de vidéos dans le store, les charger
      if (videos.length === 0) {
        console.log('[WatchListPage] Chargement des vidéos...');
        await loadVideos();
      }
      
      setIsLoading(false);
    };
    
    init();
  }, [loadVideos, videos.length]);

  // ——— Filtrer les vidéos de la watchlist ———
  useEffect(() => {
    if (videos.length > 0 && watchList.length > 0) {
      const filtered = videos.filter(v => watchList.includes(v.id));
      setListVideos(filtered);
      console.log('[WatchListPage] Vidéos dans la liste:', filtered.length);
    } else {
      setListVideos([]);
    }
  }, [videos, watchList]);

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className="page-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px' }}>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: TEXT_P,
          margin: '0 0 8px', letterSpacing: -1,
        }}>Ma liste</h1>
        <p style={{ fontSize: 14, color: TEXT_S, margin: '0 0 32px' }}>
          Chargement...
        </p>
        <div className="video-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px' }}>

      {/* ——— Header ——— */}
      <h1 style={{
        fontSize: 32, fontWeight: 800, color: TEXT_P,
        margin: '0 0 8px', letterSpacing: -1,
      }}>Ma liste</h1>
      <p style={{ fontSize: 14, color: TEXT_S, margin: '0 0 32px' }}>
        {listVideos.length} vidéo{listVideos.length > 1 ? 's' : ''} à regarder plus tard
      </p>

      {/* ——— Vide ——— */}
      {listVideos.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, borderRadius: 16,
          background: CARD, border: `1px solid ${BORDER}`,
        }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📺</span>
          <p style={{ fontSize: 16, color: TEXT_S, margin: 0 }}>
            Ta liste est vide. Ajoute des vidéos depuis le catalogue.
          </p>
        </div>
      ) : (
        <div className="video-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {listVideos.map(v => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}

    </div>
  );
}