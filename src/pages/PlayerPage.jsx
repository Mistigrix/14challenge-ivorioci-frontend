import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useVideoStore } from '../store/useVideoStore';
import { videos } from '../data/mockData';
import VideoCard, { getCoverGradient, fmtDuration } from '../components/VideoCard';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, FullscreenIcon, StarIcon, FilmIcon } from '../components/Icons';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';

const fmtTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
};

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const {
    selectedVideo, isPlaying, playerTime, playerQuality, playbackSpeed,
    setVideo, togglePlay, setPlayerTime, setQuality, setSpeed,
  } = usePlayerStore();

  const { watchList, toggleWatchList } = useVideoStore();

  const video = videos.find(v => v.id === Number(id));

  // ——— Charge la video au montage ———
  useEffect(() => {
    if (video) setVideo(video);
  }, [id]);

  // ——— Simulation lecture ———
  useEffect(() => {
    if (isPlaying && selectedVideo) {
      intervalRef.current = setInterval(() => {
        setPlayerTime(
          usePlayerStore.getState().playerTime >= selectedVideo.duration
            ? selectedVideo.duration
            : usePlayerStore.getState().playerTime + 1
        );
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, selectedVideo]);

  if (!video) {
    return (
      <div style={{
        paddingTop: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'center', minHeight: '80vh',
        flexDirection: 'column', gap: 16,
      }}>
        <FilmIcon size={48} color={TEXT_DIM} />
        <p style={{ color: TEXT_S, fontSize: 14 }}>Vidéo introuvable</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: CI_O, color: '#FFF', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
          }}>Retour à l'accueil</button>
      </div>
    );
  }

  const progress = selectedVideo
    ? (playerTime / selectedVideo.duration) * 100
    : 0;

  const similarVideos = videos
    .filter(v => v.id !== video.id && v.genres.some(g => video.genres.includes(g)))
    .slice(0, 4);

  const isInList = watchList.includes(video.id);

  return (
    <div style={{ paddingTop: 56 }}>

      {/* ——— Player ——— */}
      <div style={{
        width: '100%', aspectRatio: '16/9', maxHeight: '70vh',
        background: '#000', position: 'relative', overflow: 'hidden',
      }}>

        {/* Fond simule */}
        <div style={{
          width: '100%', height: '100%',
          background: getCoverGradient(video.title),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FilmIcon
            size={64}
            color={`rgba(255,255,255,${isPlaying ? 0.15 : 0.4})`}
          />
        </div>

        {/* ——— Controles ——— */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          padding: '40px 24px 16px',
        }}>

          {/* Barre de progression */}
          <div
            style={{
              height: 4, background: 'rgba(255,255,255,0.2)',
              borderRadius: 2, cursor: 'pointer', marginBottom: 12,
              position: 'relative',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setPlayerTime(Math.floor(pct * video.duration));
            }}>
            <div style={{
              height: '100%', width: `${progress}%`, borderRadius: 2,
              background: CI_O, transition: 'width 0.3s linear',
            }} />
            <div style={{
              position: 'absolute', top: -4, left: `${progress}%`,
              width: 12, height: 12, borderRadius: '50%', background: CI_O,
              transform: 'translateX(-50%)',
              boxShadow: `0 0 8px ${CI_O}60`,
            }} />
          </div>

          {/* Boutons controles */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>

            {/* Gauche */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={togglePlay}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#FFF', padding: 4, display: 'flex',
                }}>
                {isPlaying
                  ? <PauseIcon size={22} color="#FFF" />
                  : <PlayIcon size={22} color="#FFF" />
                }
              </button>
              <button style={{
                background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, display: 'flex',
              }}>
                <SkipBackIcon size={18} color="#FFF" />
              </button>
              <button style={{
                background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, display: 'flex',
              }}>
                <SkipForwardIcon size={18} color="#FFF" />
              </button>
              <span className="player-time" style={{
                fontSize: 12, color: 'rgba(255,255,255,0.7)',
              }}>
                {fmtTime(playerTime)} / {fmtTime(video.duration)}
              </span>
            </div>

            {/* Droite */}
            <div className="player-controls-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

              {/* Vitesse */}
              <select
                value={playbackSpeed}
                onChange={e => setSpeed(Number(e.target.value))}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  borderRadius: 4, color: '#FFF', fontSize: 11,
                  padding: '4px 8px', cursor: 'pointer',
                }}>
                {[0.5, 1, 1.5, 2].map(s => (
                  <option key={s} value={s}>{s}x</option>
                ))}
              </select>

              {/* Qualite */}
              <select
                value={playerQuality}
                onChange={e => setQuality(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  borderRadius: 4, color: '#FFF', fontSize: 11,
                  padding: '4px 8px', cursor: 'pointer',
                }}>
                {['auto', '1080p', '720p', '480p'].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>

              {/* Plein ecran */}
              <button style={{
                background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, display: 'flex',
              }}>
                <FullscreenIcon size={18} color="#FFF" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ——— Infos video ——— */}
      <div className="info-section page-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 40px' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1 }}>

            <h1 style={{
              fontSize: 28, fontWeight: 800, color: TEXT_P,
              margin: '0 0 8px', letterSpacing: -0.5,
            }}>{video.title}</h1>

            {/* Badges */}
            <div style={{
              display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 11, color: TEXT_S }}>{video.releaseDate}</span>
              <span style={{ color: TEXT_DIM }}>·</span>
              <span style={{ fontSize: 11, color: TEXT_S }}>{fmtDuration(video.duration)}</span>
              <span style={{ color: TEXT_DIM }}>·</span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 4,
                background: `${CI_O}15`, color: CI_O, fontWeight: 500,
              }}>{video.rating}</span>
              {video.genres.map(g => (
                <span key={g} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: `${CI_G}15`, color: CI_G, fontWeight: 500,
                }}>{g}</span>
              ))}
            </div>

            {/* Description */}
            <p style={{
              fontSize: 14, lineHeight: 1.7, color: TEXT_S, margin: '0 0 16px',
            }}>{video.description}</p>

            {/* Bouton watchlist */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => toggleWatchList(video.id)}
                style={{
                  padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${BORDER}`,
                  background: isInList ? `${CI_O}15` : 'transparent',
                  color: isInList ? CI_O : TEXT_S,
                  fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <StarIcon size={14} color={isInList ? CI_O : TEXT_S} filled={isInList} />
                {isInList ? 'Dans ma liste' : 'Ajouter à ma liste'}
              </button>
            </div>

            {/* Details */}
            <div style={{
              marginTop: 24, paddingTop: 16,
              borderTop: `1px solid ${BORDER}`,
            }}>
              <p style={{ fontSize: 12, color: TEXT_S, margin: '0 0 6px' }}>
                <span style={{ color: TEXT_DIM }}>Réalisateur : </span>
                {video.director}
              </p>
              <p style={{ fontSize: 12, color: TEXT_S, margin: 0 }}>
                <span style={{ color: TEXT_DIM }}>Casting : </span>
                {video.cast.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* ——— Videos similaires ——— */}
        {similarVideos.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: TEXT_P, margin: '0 0 14px',
            }}>Vidéos similaires</h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {similarVideos.map(v => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
