import { useEffect } from 'react';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useVideoStore } from '../store/useVideoStore';
import VideoCard from './VideoCard';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const TEXT_P = '#F0EDE6';
const TEXT_DIM = '#444444';
const TEXT_S = '#777777';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';

export default function RecommendationsRow() {
  const {
    recommendations, trending, continueWatching,
    isLoading, generateRecommendations,
  } = useRecommendationStore();

  const { watchHistory, watchList, videos } = useVideoStore();

  useEffect(() => {
    // Générer les recommandations uniquement si on a des vidéos et un historique
    if (videos && videos.length > 0) {
      console.log('[RecommendationsRow] Génération des recommandations...');
      console.log('[RecommendationsRow] Vidéos disponibles:', videos.length);
      console.log('[RecommendationsRow] Historique:', watchHistory.length);
      console.log('[RecommendationsRow] Watchlist:', watchList.length);
      
      generateRecommendations(watchHistory, watchList);
    }
  }, [watchHistory, watchList, videos, generateRecommendations]);

  // Si pas de vidéos du tout
  if (!videos || videos.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 20px',
        borderRadius: 16, background: CARD,
        border: `1px solid ${BORDER}`, marginBottom: 36,
      }}>
        <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📺</span>
        <p style={{ fontSize: 14, color: TEXT_S, margin: 0 }}>
          Chargement des vidéos...
        </p>
      </div>
    );
  }

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

  const SectionHeader = ({ icon, title, badge, badgeColor, count }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 14,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_P, margin: 0 }}>
        <span style={{ marginRight: 8 }}>{icon}</span>
        {title}
        {badge && (
          <span style={{
            fontSize: 10, marginLeft: 10, padding: '3px 8px',
            borderRadius: 6, background: `${badgeColor}15`, color: badgeColor,
            fontWeight: 600, verticalAlign: 'middle',
          }}>{badge}</span>
        )}
      </h2>
      {count && (
        <span style={{ fontSize: 11, color: TEXT_DIM }}>{count} vidéos</span>
      )}
    </div>
  );

  return (
    <>
      {/* ——— Recommandations ——— */}
      {recommendations && recommendations.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <SectionHeader
            icon="✨" title="Recommandés pour vous"
            badge="IA" badgeColor={CI_O}
            count={recommendations.length}
          />
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {recommendations.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      )}

      {/* ——— Reprendre le visionnage ——— */}
      {continueWatching && continueWatching.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <SectionHeader icon="⏯️" title="Reprendre le visionnage" />
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {continueWatching.map(v => <VideoCard key={v.id} video={v} size="small" />)}
          </div>
        </div>
      )}

      {/* ——— Tendances ——— */}
      {trending && trending.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <SectionHeader
            icon="🔥" title="Tendances"
            badge="LIVE" badgeColor={CI_G}
            count={trending.length}
          />
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {trending.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      )}

      {/* ——— Message si rien n'est affiché ——— */}
      {(!recommendations || recommendations.length === 0) && 
       (!continueWatching || continueWatching.length === 0) && 
       (!trending || trending.length === 0) && (
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