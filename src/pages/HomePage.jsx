import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import { categoriesData, videos } from '../data/mockData';
import VideoCard, { getCoverGradient, fmtDuration } from '../components/VideoCard';
import CategoryRow from '../components/CategoryRow';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';

export default function HomePage() {
  const navigate = useNavigate();
  const { watchList, toggleWatchList, watchHistory } = useVideoStore();

  const heroVideo = videos[0];
  const inProgress = watchHistory.filter(h => h.percentage < 100);

  return (
    <div style={{ paddingTop: 56 }}>

      {/* ——— Hero Banner ——— */}
      <div style={{
        height: 420, position: 'relative', overflow: 'hidden',
        background: getCoverGradient(heroVideo.title),
      }}>
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,14,1) 0%, rgba(10,10,14,0.4) 50%, rgba(10,10,14,0.2) 100%)',
        }} />

        {/* Contenu hero */}
        <div style={{
          position: 'absolute', bottom: 60, left: 48, right: 48, zIndex: 10,
        }}>
          <span style={{
            fontSize: 10, padding: '4px 10px', borderRadius: 6,
            background: `${CI_O}20`, color: CI_O,
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
          }}>En vedette</span>

          <h1 style={{
            fontSize: 42, fontWeight: 800, color: TEXT_P,
            margin: '12px 0 8px', letterSpacing: -1.5,
          }}>{heroVideo.title}</h1>

          <p style={{
            fontSize: 14, color: TEXT_S, margin: '0 0 20px', maxWidth: 550,
          }}>{heroVideo.description}</p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={() => navigate(`/player/${heroVideo.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12, border: 'none',
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${CI_O}, #FFa040)`,
                color: '#FFF', fontSize: 14, fontWeight: 600,
                boxShadow: `0 4px 16px ${CI_O}40`,
              }}>▶ Lecture</button>

            <button
              onClick={() => toggleWatchList(heroVideo.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12, cursor: 'pointer',
                border: '1px solid #2A2A35',
                background: 'rgba(255,255,255,0.05)',
                color: TEXT_P, fontSize: 13,
              }}>
              {watchList.includes(heroVideo.id) ? '★ Dans ma liste' : '☆ Ma liste'}
            </button>

            <span style={{ fontSize: 11, color: TEXT_S }}>
              {heroVideo.genres.join(' · ')} — {fmtDuration(heroVideo.duration)} — {heroVideo.rating}
            </span>
          </div>
        </div>
      </div>

      {/* ——— Reprendre le visionnage ——— */}
      {inProgress.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 0' }}>
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: TEXT_P, margin: '0 0 14px',
          }}>⏯️ Reprendre le visionnage</h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {inProgress.map(h => {
              const video = videos.find(v => v.id === h.videoId);
              return video ? <VideoCard key={video.id} video={video} size="small" /> : null;
            })}
          </div>
        </div>
      )}

      {/* ——— Catégories ——— */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 40px' }}>
        {categoriesData.map(c => (
          <CategoryRow key={c.id} category={c} />
        ))}
      </div>

    </div>
  );
}