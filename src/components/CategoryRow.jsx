import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import VideoCard from './VideoCard';

const CI_O = '#FF8C00';
const TEXT_P = '#F0EDE6';
const TEXT_DIM = '#444';

export default function CategoryRow({ category }) {
  const navigate = useNavigate();
  const { videos } = useVideoStore();

  const catVideos = videos.filter(v => v.category === category.id);

  return (
    <div style={{ marginBottom: 36 }}>

      {/* ——— Header ——— */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14,
      }}>
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: TEXT_P, margin: 0,
        }}>
          <span style={{ marginRight: 8 }}>{category.icon}</span>
          {category.name}
          <span style={{
            color: TEXT_DIM, fontWeight: 400, fontSize: 12, marginLeft: 8,
          }}>{catVideos.length}</span>
        </h2>

        {/* ——— Voir tout → navigue vers /catalogue?category=id ——— */}
        <span
          onClick={() => navigate(`/catalogue?category=${category.id}`)}
          style={{
            fontSize: 11, color: CI_O, cursor: 'pointer', fontWeight: 500,
          }}>
          Voir tout →
        </span>
      </div>

      {/* ——— Scroll horizontal ——— */}
      <div style={{
        display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
      }}>
        {catVideos.map(v => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}