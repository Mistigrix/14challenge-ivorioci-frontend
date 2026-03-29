// components/VideoCard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoStore } from "../store/useVideoStore";
import { PlayIcon, StarIcon, CheckIcon } from "./Icons";
import { catalogueService } from "../services/api";

const CI_O = "#FF8C00";
const CI_G = "#009E49";
const TEXT_P = "#F0EDE6";
const TEXT_S = "#777777";
const TEXT_DIM = "#444444";

export const getCoverGradient = (title) => {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(145deg, hsl(${hue1},60%,25%), hsl(${hue2},50%,18%))`;
};

export const fmtDuration = (secs) => {
  if (!secs) return "0min";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ""}` : `${m}min`;
};

// Composant pour charger la thumbnail
function VideoThumbnail({ videoId, thumbnailUrl, title, onLoad }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!thumbnailUrl) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError(true);
          setIsLoading(false);
          return;
        }

        const url = catalogueService.getThumbnailUrl(thumbnailUrl);
        console.log('[VideoThumbnail] Chargement:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
        if (onLoad) onLoad();
        
      } catch (err) {
        console.error('[VideoThumbnail] ❌ Erreur:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadThumbnail();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [thumbnailUrl]);

  if (isLoading) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: getCoverGradient(title),
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          width: 30, height: 30,
          border: `2px solid ${CI_O}20`,
          borderTop: `2px solid ${CI_O}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: getCoverGradient(title),
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 32 }}>🎬</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
}

export default function VideoCard({ video, size = "medium" }) {
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
    <div
      style={{ width: w, minWidth: 0, flexShrink: 0, cursor: "pointer" }}
      onClick={() => navigate(`/player/${video.id}`)}>

      {/* ——— Thumbnail ——— */}
      <div
        style={{
          width: "100%", height: h, borderRadius: 12, overflow: "hidden",
          position: "relative",
          marginBottom: 10, transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
          const overlay = e.currentTarget.querySelector(".play-overlay");
          if (overlay) overlay.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
          const overlay = e.currentTarget.querySelector(".play-overlay");
          if (overlay) overlay.style.opacity = "0";
        }}>

        {/* Image de fond */}
        <VideoThumbnail
          videoId={video.id}
          thumbnailUrl={video.thumbnailUrl}
          title={video.title}
        />

        {/* ——— Play overlay ——— */}
        <div className="play-overlay" style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)", opacity: 0,
          transition: "opacity 0.3s", zIndex: 3,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PlayIcon size={20} color="#0A0A0E" />
          </div>
        </div>

        {/* ——— Rating ——— */}
        {video.rating && (
          <span style={{
            position: "absolute", top: 8, left: 8, zIndex: 2,
            background: video.rating === "16+" ? "#E74C3C"
              : video.rating === "12+" ? CI_O : CI_G,
            borderRadius: 4, padding: "2px 6px",
            fontSize: 9, color: "#FFF", fontWeight: 600,
          }}>{video.rating}</span>
        )}

        {/* ——— Badge vu ——— */}
        {prog === 100 && (
          <div style={{
            position: "absolute", top: 8, right: 8, zIndex: 2,
            background: CI_G, borderRadius: 4,
            padding: "2px 6px", fontSize: 9, color: "#FFF", fontWeight: 600,
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <CheckIcon size={10} color="#FFF" /> Vu
          </div>
        )}

        {/* ——— Gradient bas ——— */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "65%",
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
          borderRadius: "0 0 12px 12px",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* ——— Barre de progression ——— */}
        {prog > 0 && prog < 100 && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 3, background: "rgba(255,255,255,0.3)", zIndex: 2,
          }}>
            <div style={{
              height: "100%", width: `${prog}%`,
              background: CI_O, borderRadius: 2,
            }} />
          </div>
        )}

        {/* ——— Durée ——— */}
        <span style={{
          position: "absolute", bottom: 8, right: 8, zIndex: 2,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          borderRadius: 4, padding: "2px 6px",
          fontSize: 10, color: "#FFF", fontWeight: 600,
        }}>{fmtDuration(video.duration)}</span>

        {/* ——— Titre dans thumbnail ——— */}
        <div style={{
          position: "absolute",
          bottom: prog > 0 && prog < 100 ? 14 : 8,
          left: 8, right: 48, zIndex: 2,
        }}>
          <p style={{
            fontSize: size === "large" ? 14 : 12,
            fontWeight: 700, color: "#FFFFFF", margin: 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            padding: "2px 8px", borderRadius: 4,
            display: "inline-block", maxWidth: "100%",
          }}>{video.title}</p>
        </div>

      </div>

      {/* ——— Infos sous la carte ——— */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: TEXT_P,
            margin: "0 0 3px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{video.title}</p>
          <p style={{ fontSize: 11, color: TEXT_S, margin: "0 0 4px" }}>
            {video.genres?.join(" · ") || video.categoryName || "Non catégorisé"}
          </p>
          <p style={{ fontSize: 10, color: TEXT_DIM, margin: 0 }}>
            {video.releaseDate || new Date(video.createdAt).getFullYear()}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWatchList(video.id); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 4, transition: "all 0.2s", display: "flex",
          }}>
          <StarIcon size={18} color={isInList ? CI_O : TEXT_DIM} filled={isInList} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}