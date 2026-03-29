// PlayerPage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayerStore } from "../store/usePlayerStore";
import { useVideoStore } from "../store/useVideoStore";
import VideoCard, {
  getCoverGradient,
  fmtDuration,
} from "../components/VideoCard";
import SecureVideoPlayer from "../components/SecureVideoPlayer";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  FullscreenIcon,
  StarIcon,
  FilmIcon,
} from "../components/Icons";

const CI_O = "#FF8C00";
const CI_G = "#009E49";
const BORDER = "#2A2A35";
const TEXT_P = "#F0EDE6";
const TEXT_S = "#777";
const TEXT_DIM = "#444";

const fmtTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const videoElementRef = useRef(null);

  const {
    selectedVideo,
    isPlaying,
    playerTime,
    playerQuality,
    playbackSpeed,
    setVideo,
    togglePlay,
    setPlayerTime,
    setQuality,
    setSpeed,
  } = usePlayerStore();

  const {
    videos,
    watchList,
    toggleWatchList,
    loadVideos,
    addToHistory,
    getProgress,
  } = useVideoStore();

  const [isLoading, setIsLoading] = useState(true);
  const [video, setLocalVideo] = useState(null);

  // ——— Charger les vidéos si nécessaire ———
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // Si pas de vidéos dans le store, les charger
      if (videos.length === 0) {
        console.log("[PlayerPage] Chargement des vidéos...");
        await loadVideos();
      }

      // Trouver la vidéo dans le store
      const foundVideo = videos.find((v) => v.id === id);
      if (foundVideo) {
        console.log("[PlayerPage] Vidéo trouvée:", foundVideo.title);
        setLocalVideo(foundVideo);
        setVideo(foundVideo);

        // Récupérer la progression depuis l'historique
        const progress = getProgress(foundVideo.id);
        if (progress > 0 && progress < 100) {
          const savedTime = Math.floor((progress / 100) * foundVideo.duration);
          setPlayerTime(savedTime);
          console.log("[PlayerPage] Progression restaurée:", savedTime, "s");
        }
      } else {
        console.error("[PlayerPage] Vidéo non trouvée:", id);
      }

      setIsLoading(false);
    };

    init();
  }, [id, loadVideos, videos, setVideo, setPlayerTime, getProgress]);

  // Synchroniser la vidéo quand elle est chargée
  useEffect(() => {
    if (videoElementRef.current && !isLoading && video) {
      // Restaurer la progression
      if (playerTime > 0) {
        videoElementRef.current.currentTime = playerTime;
      }

      // Synchroniser la vitesse
      videoElementRef.current.playbackRate = playbackSpeed;

      // Synchroniser l'état de lecture
      if (isPlaying) {
        videoElementRef.current
          .play()
          .catch((e) => console.log("[PlayerPage] Lecture:", e));
      } else {
        videoElementRef.current.pause();
      }
    }
  }, [isLoading, video, playerTime, isPlaying, playbackSpeed]);

  // Ajoutez cet effet dans PlayerPage.jsx pour nettoyer les ressources
  useEffect(() => {
    // Nettoyer les URLs blob quand le composant est démonté
    return () => {
      if (videoElementRef.current) {
        // Arrêter la lecture
        videoElementRef.current.pause();
        // Supprimer la source
        videoElementRef.current.src = "";
        videoElementRef.current.load();
      }
    };
  }, []);
  // Sauvegarder la progression périodiquement
  useEffect(() => {
    if (video && isPlaying && playerTime > 0) {
      const interval = setInterval(() => {
        const percentage = Math.floor((playerTime / video.duration) * 100);
        if (percentage > 0 && percentage < 100) {
          addToHistory(video.id, percentage);
          console.log("[PlayerPage] Progression sauvegardée:", percentage, "%");
        }
      }, 5000); // Toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [video, isPlaying, playerTime, addToHistory]);

  // Gestion du temps de la vidéo
  const handleTimeUpdate = (e) => {
    const currentTime = e.currentTarget.currentTime;
    setPlayerTime(currentTime);
  };

  const handleEnded = () => {
    console.log("[PlayerPage] Vidéo terminée");
    togglePlay();
    if (video) {
      addToHistory(video.id, 100);
    }
  };

  const handleLoadedMetadata = (e) => {
    console.log("[PlayerPage] Métadonnées chargées");
    if (video && playerTime > 0 && videoElementRef.current) {
      videoElementRef.current.currentTime = playerTime;
    }
  };

  // ——— Contrôles de la vidéo (CORRIGÉS) ———
  const togglePlayHandler = () => {
    if (videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
        togglePlay();
      } else {
        videoElementRef.current
          .play()
          .then(() => {
            togglePlay();
          })
          .catch((e) => console.log("[PlayerPage] Erreur lecture:", e));
      }
    } else {
      togglePlay();
    }
  };

  const handleSeek = (e) => {
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = Math.min(
      Math.max(0, Math.floor(pct * video.duration)),
      video.duration,
    );
    setPlayerTime(newTime);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = newTime;
    }
  };

  const handleSkipBack = () => {
    if (!video) return;
    const newTime = Math.max(0, playerTime - 10);
    setPlayerTime(newTime);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = newTime;
    }
  };

  const handleSkipForward = () => {
    if (!video) return;
    const newTime = Math.min(video.duration, playerTime + 10);
    setPlayerTime(newTime);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = () => {
    if (videoElementRef.current) {
      if (videoElementRef.current.requestFullscreen) {
        videoElementRef.current.requestFullscreen();
      }
    }
  };

  const handleSpeedChange = (e) => {
    const speed = Number(e.target.value);
    setSpeed(speed);
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = speed;
    }
  };

  // Afficher le loader pendant le chargement
  if (isLoading) {
    return (
      <div
        style={{
          paddingTop: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ color: TEXT_P }}>Chargement de la vidéo...</div>
      </div>
    );
  }

  // Vidéo non trouvée
  if (!video) {
    return (
      <div
        style={{
          paddingTop: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <FilmIcon size={48} color={TEXT_DIM} />
        <p style={{ color: TEXT_S, fontSize: 14 }}>Vidéo introuvable</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            border: "none",
            background: CI_O,
            color: "#FFF",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const progress = (playerTime / video.duration) * 100;
  const isInList = watchList.includes(video.id);

  // Vidéos similaires
  const similarVideos = videos
    .filter(
      (v) =>
        v.id !== video.id &&
        (v.genres?.some((g) => video.genres?.includes(g)) ||
          v.categoryId === video.categoryId),
    )
    .slice(0, 4);

  return (
    <div style={{ paddingTop: 56 }}>
      {/* ——— Player ——— */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          maxHeight: "70vh",
          background: "#000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Lecteur vidéo sécurisé */}
        <SecureVideoPlayer
          ref={videoElementRef}
          videoId={video.id}
          autoPlay={isPlaying}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {/* ——— Controles superposés ——— */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
            padding: "40px 24px 16px",
            pointerEvents: "none",
          }}
        >
          {/* Barre de progression - interactive */}
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              cursor: "pointer",
              marginBottom: 12,
              position: "relative",
              pointerEvents: "auto",
            }}
            onClick={handleSeek}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: 2,
                background: CI_O,
                transition: "width 0.1s linear",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -4,
                left: `${progress}%`,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: CI_O,
                transform: "translateX(-50%)",
                boxShadow: `0 0 8px ${CI_O}60`,
              }}
            />
          </div>

          {/* Boutons controles - interactifs */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pointerEvents: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={togglePlayHandler}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#FFF",
                  padding: 4,
                  display: "flex",
                }}
              >
                {isPlaying ? (
                  <PauseIcon size={22} color="#FFF" />
                ) : (
                  <PlayIcon size={22} color="#FFF" />
                )}
              </button>
              <button
                onClick={handleSkipBack}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                }}
              >
                <SkipBackIcon size={18} color="#FFF" />
              </button>
              <button
                onClick={handleSkipForward}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                }}
              >
                <SkipForwardIcon size={18} color="#FFF" />
              </button>
              <span
                className="player-time"
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {fmtTime(playerTime)} / {fmtTime(video.duration)}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <select
                value={playbackSpeed}
                onChange={handleSpeedChange}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 4,
                  color: "#FFF",
                  fontSize: 11,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                {[0.5, 1, 1.5, 2].map((s) => (
                  <option key={s} value={s}>
                    {s}x
                  </option>
                ))}
              </select>

              <select
                value={playerQuality}
                onChange={(e) => setQuality(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 4,
                  color: "#FFF",
                  fontSize: 11,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                {["auto", "1080p", "720p", "480p"].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>

              <button
                onClick={handleFullscreen}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                }}
              >
                <FullscreenIcon size={18} color="#FFF" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Infos vidéo ——— */}
      <div
        className="info-section page-container"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 40px" }}
      >
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: TEXT_P,
                margin: "0 0 8px",
                letterSpacing: -0.5,
              }}
            >
              {video.title}
            </h1>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 11, color: TEXT_S }}>
                {video.releaseDate || new Date(video.createdAt).getFullYear()}
              </span>
              <span style={{ color: TEXT_DIM }}>·</span>
              <span style={{ fontSize: 11, color: TEXT_S }}>
                {fmtDuration(video.duration)}
              </span>
              <span style={{ color: TEXT_DIM }}>·</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: `${CI_O}15`,
                  color: CI_O,
                  fontWeight: 500,
                }}
              >
                {video.rating || "N/A"}
              </span>
              {video.genres?.map((g) => (
                <span
                  key={g}
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: `${CI_G}15`,
                    color: CI_G,
                    fontWeight: 500,
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: TEXT_S,
                margin: "0 0 16px",
              }}
            >
              {video.description}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => toggleWatchList(video.id)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: `1px solid ${BORDER}`,
                  background: isInList ? `${CI_O}15` : "transparent",
                  color: isInList ? CI_O : TEXT_S,
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <StarIcon
                  size={14}
                  color={isInList ? CI_O : TEXT_S}
                  filled={isInList}
                />
                {isInList ? "Dans ma liste" : "Ajouter à ma liste"}
              </button>
            </div>

            {video.category && (
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: `1px solid ${BORDER}`,
                }}
              >
                <p style={{ fontSize: 12, color: TEXT_S, margin: 0 }}>
                  <span style={{ color: TEXT_DIM }}>Catégorie : </span>
                  {typeof video.category === "string"
                    ? video.category
                    : video.category?.name || "Non catégorisé"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ——— Vidéos similaires ——— */}
        {similarVideos.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: TEXT_P,
                margin: "0 0 14px",
              }}
            >
              Vidéos similaires
            </h2>
            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 8,
              }}
            >
              {similarVideos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
