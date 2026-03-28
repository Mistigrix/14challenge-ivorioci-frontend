import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import { PlayIcon, StarIcon, CheckIcon } from './Icons';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';

export const getCoverGradient = (title) => {
  const hash = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(145deg, hsl(${hue1},60%,25%), hsl(${hue2},50%,18%))`;
};

export const fmtDuration = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m}min`;
};

export default function VideoCard({ video, size = 'medium' }) {
  const navigate = useNavigate();
  const { watchList, toggleWatchList, getProgress } = useVideoStore();

  const prog = getProgress(video.id);
  const isInList = watchList.includes(video.id);

  const dimensions = {
    large:  { w: 320, h: 180 },
    medium: { w: 240, h: 135 },
    small:  { w: 180, h: 100 },
  };
  const { w, h } = dimensions[size] || dimensions.medium;

  return (
    <div style={{ width: w, minWidth: 0, flexShrink: 0, cursor: 'pointer' }}
      onClick={() => navigate(`/player/${video.id}`)}>

      {/* ——— Thumbnail ——— */}
      <div
        style={{
          width: '100%', height: h, borderRadius: 12, overflow: 'hidden',
          background: getCoverGradient(video.title), position: 'relative',
          marginBottom: 10, transition: 'all 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
          e.currentTarget.querySelector('.play-overlay').style.opacity = '1';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.querySelector('.play-overlay').style.opacity = '0';
        }}>

        {/* Play overlay */}
        <div className="play-overlay" style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PlayIcon size={20} color="#0A0A0E" />
          </div>
        </div>

        {/* Duree */}
        <span style={{
          position: 'absolute', bottom: 8, right: 8,
          background: 'rgba(0,0,0,0.7)', borderRadius: 4,
          padding: '2px 6px', fontSize: 10, color: '#FFF', fontWeight: 500,
        }}>{fmtDuration(video.duration)}</span>

        {/* Rating */}
        <span style={{
          position: 'absolute', top: 8, left: 8,
          background: video.rating === '16+' ? '#E74C3C'
            : video.rating === '12+' ? CI_O : CI_G,
          borderRadius: 4, padding: '2px 6px',
          fontSize: 9, color: '#FFF', fontWeight: 600,
        }}>{video.rating}</span>

        {/* Barre de progression */}
        {prog > 0 && prog < 100 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 3, background: 'rgba(255,255,255,0.2)',
          }}>
            <div style={{
              height: '100%', width: `${prog}%`,
              background: CI_O, borderRadius: 2,
            }} />
          </div>
        )}

        {/* Badge vu */}
        {prog === 100 && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: CI_G, borderRadius: 4,
            padding: '2px 6px', fontSize: 9, color: '#FFF', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <CheckIcon size={10} color="#FFF" /> Vu
          </div>
        )}

        {/* Titre dans thumbnail */}
        <div style={{
          position: 'absolute', bottom: prog > 0 && prog < 100 ? 16 : 8,
          left: 12, right: 40,
        }}>
          <p style={{
            fontSize: size === 'large' ? 16 : 13,
            fontWeight: 700, color: '#FFF', margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{video.title}</p>
        </div>
      </div>

      {/* ——— Infos ——— */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: TEXT_P, margin: '0 0 3px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{video.title}</p>
          <p style={{ fontSize: 11, color: TEXT_S, margin: '0 0 4px' }}>
            {video.genres.join(' · ')}
          </p>
          <p style={{ fontSize: 10, color: TEXT_DIM, margin: 0 }}>
            {video.releaseDate}
          </p>
        </div>

        {/* Bouton watchlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWatchList(video.id); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, transition: 'all 0.2s', display: 'flex',
          }}
          title={isInList ? 'Retirer de la liste' : 'À regarder plus tard'}>
          <StarIcon size={18} color={isInList ? CI_O : TEXT_DIM} filled={isInList} />
        </button>
      </div>
    </div>
  );
}
