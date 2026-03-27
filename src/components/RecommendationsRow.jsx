import { useEffect } from 'react';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useVideoStore } from '../store/useVideoStore';
import VideoCard from './VideoCard';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const TEXT_P = '#F0EDE6';
const TEXT_DIM = '#444';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const TEXT_S = '#777';

export default function RecommendationsRow() {
  const { recommendations, trending, continueWatching, isLoading, generateRecommendations } =
    useRecommendationStore();
  const { watchHistory, watchList } = useVideoStore();

  // ——— Génère les recommandations au montage ———
  useEffect(() => {
    generateRecommendations(watchHistory, watchList);
  }, [watchHistory, watchList]);

  if (isLoading) {
    return (
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 240, height: 135, borderRadius: 12,
              background: CARD, border: `1px solid ${BORDER}`,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>

      {/* ——— Recommandations personnalisées ——— */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 14,
          }}>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: TEXT_P, margin: 0,
            }}>
              <span style={{ marginRight: 8 }}>✨</span>
              Recommandés pour vous
              <span style={{
                fontSize: 10, marginLeft: 10, padding: '3px 8px',
                borderRadius: 6, background: `${CI_O}15`, color: CI_O,
                fontWeight: 600, verticalAlign: 'middle',
              }}>IA</span>
            </h2>
            <span style={{ fontSize: 11, color: TEXT_DIM }}>
              {recommendations.length} vidéos
            </span>
          </div>
          <div style={{
            display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
          }}>
            {recommendations.map(v => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      )}

      {/* ——— Reprendre le visionnage ——— */}
      {continueWatching.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 14,
          }}>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: TEXT_P, margin: 0,
            }}>
              <span style={{ marginRight: 8 }}>⏯️</span>
              Reprendre le visionnage
            </h2>
          </div>
          <div style={{
            display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
          }}>
            {continueWatching.map(v => (
              <VideoCard key={v.id} video={v} size="small" />
            ))}
          </div>
        </div>
      )}

      {/* ——— Tendances ——— */}
      {trending.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 14,
          }}>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: TEXT_P, margin: 0,
            }}>
              <span style={{ marginRight: 8 }}>🔥</span>
              Tendances
              <span style={{
                fontSize: 10, marginLeft: 10, padding: '3px 8px',
                borderRadius: 6, background: `${CI_G}15`, color: CI_G,
                fontWeight: 600, verticalAlign: 'middle',
              }}>LIVE</span>
            </h2>
            <span style={{ fontSize: 11, color: TEXT_DIM }}>
              {trending.length} vidéos
            </span>
          </div>
          <div style={{
            display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
          }}>
            {trending.map(v => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      )}

      {/* ——— Aucune recommandation ——— */}
      {recommendations.length === 0 && continueWatching.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          borderRadius: 16, background: CARD,
          border: `1px solid ${BORDER}`, marginBottom: 36,
        }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🎬</span>
          <p style={{ fontSize: 14, color: TEXT_S, margin: 0 }}>
            Commence à regarder des vidéos pour recevoir des recommandations personnalisées !
          </p>
        </div>
      )}

    </>
  );
}