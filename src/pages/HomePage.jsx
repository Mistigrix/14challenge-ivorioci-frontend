import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoStore } from "../store/useVideoStore";
import { categoriesData } from "../data/mockData";
import RecommendationsRow from "../components/RecommendationsRow";
import VideoCard, { getCoverGradient, fmtDuration } from "../components/VideoCard";
import CategoryRow from "../components/CategoryRow";
import SkeletonCard from "../components/SkeletonCard";
import { PlayIcon, StarIcon } from "../components/Icons";
import { videos } from "../data/mockData";

const CI_O = "#FF8C00";
const TEXT_P = "#F0EDE6";
const TEXT_S = "#777";

export default function HomePage() {
  const navigate = useNavigate();
  const { watchList, toggleWatchList } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true);

  const heroVideo = videos[0];
  const isInList = watchList.includes(heroVideo.id);

  // Simule un court chargement pour montrer les skeletons
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ paddingTop: 56 }}>

      {/* ——— Hero Banner ——— */}
      <div style={{
        minHeight: 320, height: '50vh', maxHeight: 420, position: "relative", overflow: "hidden",
        background: getCoverGradient(heroVideo.title),
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,10,14,1) 0%, rgba(10,10,14,0.4) 50%, rgba(10,10,14,0.2) 100%)",
        }} />

        <div className="hero-content" style={{
          position: "absolute", bottom: 60, left: 48, right: 48, zIndex: 10,
        }}>
          <span style={{
            fontSize: 10, padding: "4px 10px", borderRadius: 6,
            background: `${CI_O}20`, color: CI_O,
            fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
          }}>En vedette</span>

          <h1 className="hero-title" style={{
            fontSize: 42, fontWeight: 800, color: TEXT_P,
            margin: "12px 0 8px", letterSpacing: -1.5,
          }}>{heroVideo.title}</h1>

          <p style={{
            fontSize: 14, color: TEXT_S, margin: "0 0 20px", maxWidth: 550,
          }}>{heroVideo.description}</p>

          <div className="hero-buttons" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => navigate(`/player/${heroVideo.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 28px", borderRadius: 12, border: "none",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${CI_O}, #FFa040)`,
                color: "#FFF", fontSize: 14, fontWeight: 600,
                boxShadow: `0 4px 16px ${CI_O}40`,
              }}><PlayIcon size={14} color="#FFF" /> Lecture</button>

            <button
              onClick={() => toggleWatchList(heroVideo.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 12, cursor: "pointer",
                border: "1px solid #2A2A35",
                background: "rgba(255,255,255,0.05)",
                color: TEXT_P, fontSize: 13,
              }}>
              <StarIcon size={14} color={isInList ? CI_O : TEXT_P} filled={isInList} />
              {isInList ? "Dans ma liste" : "Ma liste"}
            </button>

            <span className="hero-meta" style={{ fontSize: 11, color: TEXT_S }}>
              {heroVideo.genres.join(" · ")} — {fmtDuration(heroVideo.duration)} — {heroVideo.rating}
            </span>
          </div>
        </div>
      </div>

      {/* ——— Recommandations + Reprendre + Tendances ——— */}
      <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0" }}>
        <RecommendationsRow />
      </div>

      {/* ——— Catégories ——— */}
      <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 40px" }}>
        {isLoading ? (
          // Skeleton loading pendant le chargement
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : (
          categoriesData.map((c) => (
            <CategoryRow key={c.id} category={c} />
          ))
        )}
      </div>

    </div>
  );
}