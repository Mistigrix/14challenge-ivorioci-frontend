import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import VideoCard from './VideoCard';

const CI_O = '#FF8C00';
const TEXT_P = '#F0EDE6';
const TEXT_DIM = '#444444';

export default function CategoryRow({ category }) {
  const navigate = useNavigate();
  const { videos } = useVideoStore();

  // Filtrer les vidéos par categoryId (qui est un UUID)
  const catVideos = videos.filter(v => {
    // Vérifier si la vidéo a un categoryId qui correspond à l'ID de la catégorie
    if (v.categoryId && category.id) {
      return v.categoryId === category.id;
    }
    // Fallback pour les anciennes données avec category slug
    if (v.category && category.slug) {
      return v.category === category.slug;
    }
    return false;
  });

  // Log pour debug (à retirer après vérification)
  if (catVideos.length === 0 && videos.length > 0) {
    console.log(`[CategoryRow] ${category.name}: 0 vidéo - ID catégorie: ${category.id}`);
    console.log(`[CategoryRow] Premieres vidéos categoryId:`, videos.slice(0, 3).map(v => ({
      title: v.title,
      categoryId: v.categoryId
    })));
  } else if (catVideos.length > 0) {
    console.log(`[CategoryRow] ${category.name}: ${catVideos.length} vidéos trouvées`);
  }

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_P, margin: 0 }}>
          {category.icon && <span style={{ marginRight: 8 }}>{category.icon}</span>}
          {category.name}
          <span style={{
            color: TEXT_DIM, fontWeight: 400, fontSize: 12, marginLeft: 8,
          }}>{catVideos.length}</span>
        </h2>
        <span
          onClick={() => navigate(`/catalogue?category=${category.id}`)}
          style={{ fontSize: 11, color: CI_O, cursor: 'pointer', fontWeight: 500 }}>
          Voir tout →
        </span>
      </div>

      {catVideos.length === 0 ? (
        <p style={{ fontSize: 12, color: TEXT_DIM, margin: 0, padding: '20px 0', textAlign: 'center' }}>
          Aucune vidéo dans cette catégorie pour l'instant.
        </p>
      ) : (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
          {catVideos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}