import { useVideoStore } from '../store/useVideoStore';
import { videos } from '../data/mockData';
import VideoCard from '../components/VideoCard';

const CI_O = '#FF8C00';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';

export default function CataloguePage() {
  const { selectedGenreFilter, setGenreFilter } = useVideoStore();

  const allGenres = ['Tous', ...new Set(videos.flatMap(v => v.genres))];
  const filtered = selectedGenreFilter === 'Tous'
    ? videos
    : videos.filter(v => v.genres.includes(selectedGenreFilter));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 40px' }}>

      {/* ——— Header ——— */}
      <h1 style={{
        fontSize: 32, fontWeight: 800, color: TEXT_P,
        margin: '0 0 8px', letterSpacing: -1,
      }}>Catalogue</h1>
      <p style={{ fontSize: 14, color: TEXT_S, margin: '0 0 24px' }}>
        {videos.length} vidéos disponibles
      </p>

      {/* ——— Filtres genre ——— */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {allGenres.map(g => (
          <button key={g}
            onClick={() => setGenreFilter(g)}
            style={{
              padding: '7px 18px', borderRadius: 20, cursor: 'pointer',
              border: selectedGenreFilter === g ? 'none' : `1px solid ${BORDER}`,
              background: selectedGenreFilter === g
                ? `linear-gradient(135deg, ${CI_O}, #FFa040)`
                : 'transparent',
              color: selectedGenreFilter === g ? '#FFF' : TEXT_S,
              fontSize: 12, fontWeight: 500, transition: 'all 0.2s',
            }}>{g}</button>
        ))}
      </div>

      {/* ——— Grille ——— */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 20,
      }}>
        {filtered.map(v => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>

    </div>
  );
}