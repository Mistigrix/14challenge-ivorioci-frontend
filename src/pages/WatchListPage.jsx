import { useVideoStore } from '../store/useVideoStore';
import { videos } from '../data/mockData';
import VideoCard from '../components/VideoCard';

const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';

export default function WatchListPage() {
  const { watchList } = useVideoStore();
  const listVideos = videos.filter(v => watchList.includes(v.id));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px' }}>

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
        <div style={{
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