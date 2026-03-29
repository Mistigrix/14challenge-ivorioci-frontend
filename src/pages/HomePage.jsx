import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoStore } from "../store/useVideoStore";
import RecommendationsRow from "../components/RecommendationsRow";
import { getCoverGradient, fmtDuration } from "../components/VideoCard";
import CategoryRow from "../components/CategoryRow";
import { PlayIcon, StarIcon } from "../components/Icons";
import { catalogueService } from "../services/api";

const CI_O = "#FF8C00";
const TEXT_P = "#F0EDE6";
const TEXT_S = "#777777";

export default function HomePage() {
  const navigate = useNavigate();
  const { watchList, toggleWatchList, videos: storeVideos, loadVideos } = useVideoStore();

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [heroVideo, setHeroVideo] = useState(null);

  const isInList = heroVideo ? watchList.includes(heroVideo.id) : false;

  // useEffect(() => {
  //   const init = async () => {
  //     setIsLoading(true);
      
  //     try {
  //       console.log('[HomePage] Initialisation...');
        
  //       // 1. Charger les vidéos via le store
  //       let videos = storeVideos;
  //       if (!videos || videos.length === 0) {
  //         console.log('[HomePage] Chargement des vidéos via le store...');
  //         await loadVideos();
  //         videos = useVideoStore.getState().videos;
  //       }
        
  //       console.log('[HomePage] Vidéos disponibles:', videos?.length || 0);
  //       if (videos && videos.length > 0) {
  //         console.log('[HomePage] Première vidéo:', videos[0].title);
  //         console.log('[HomePage] categoryId de la première vidéo:', videos[0].categoryId);
  //       }
        
  //       // 2. Charger les catégories depuis l'API
  //       try {
  //         const categoriesRes = await catalogueService.getCategories();
          
  //         // Extraire les catégories du format {success: true, data: [...]}
  //         let categoriesData = [];
  //         if (categoriesRes?.data?.data && Array.isArray(categoriesRes.data.data)) {
  //           categoriesData = categoriesRes.data.data;
  //         } else if (categoriesRes?.data && Array.isArray(categoriesRes.data)) {
  //           categoriesData = categoriesRes.data;
  //         }
          
  //         if (categoriesData.length > 0) {
  //           console.log('[HomePage] ✅ Catégories chargées:', categoriesData.length);
  //           console.log('[HomePage] Catégories:', categoriesData.map(c => ({ name: c.name, id: c.id })));
  //           setCategories(categoriesData);
  //         } else {
  //           console.warn('[HomePage] Aucune catégorie trouvée');
  //         }
  //       } catch (error) {
  //         console.error('[HomePage] ❌ Erreur chargement catégories:', error);
  //       }
        
  //       // 3. Définir la vidéo hero
  //       if (videos && videos.length > 0) {
  //         setHeroVideo(videos[0]);
  //       } else {
  //         console.error('[HomePage] ❌ Aucune vidéo disponible');
  //       }
        
  //     } catch (err) {
  //       console.error('[HomePage] ❌ Erreur générale:', err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   init();
  // }, [loadVideos]);

  // Dans HomePage
useEffect(() => {
  const init = async () => {
    setIsLoading(true);
    
    try {
      console.log('[HomePage] Initialisation...');
      
      // Forcer le chargement des vidéos depuis l'API
      const loadedVideos = await loadVideos();
      console.log('[HomePage] Vidéos chargées:', loadedVideos?.length || 0);
      
      if (loadedVideos && loadedVideos.length > 0) {
        console.log('[HomePage] Première vidéo:', {
          title: loadedVideos[0].title,
          categoryId: loadedVideos[0].categoryId
        });
        setHeroVideo(loadedVideos[0]);
      }
      
      // Charger les catégories
      const categoriesRes = await catalogueService.getCategories();
      if (categoriesRes?.data?.data && Array.isArray(categoriesRes.data.data)) {
        setCategories(categoriesRes.data.data);
        console.log('[HomePage] Catégories chargées:', categoriesRes.data.data.length);
      }
      
    } catch (err) {
      console.error('[HomePage] ❌ Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  init();
}, [loadVideos]);
  if (isLoading || !heroVideo) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ 
          minHeight: 320, 
          background: "#0A0A0E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ color: TEXT_P }}>Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Hero Banner */}
      <div style={{
        minHeight: 320, height: '50vh', maxHeight: 420,
        position: "relative", overflow: "hidden",
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
            fontSize: 14, color: TEXT_S,
            margin: "0 0 20px", maxWidth: 550,
          }}>{heroVideo.description}</p>

          <div className="hero-buttons" style={{
            display: "flex", gap: 12, alignItems: "center",
          }}>
            <button
              onClick={() => navigate(`/player/${heroVideo.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 28px", borderRadius: 12, border: "none",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${CI_O}, #FFa040)`,
                color: "#FFF", fontSize: 14, fontWeight: 600,
                boxShadow: `0 4px 16px ${CI_O}40`,
              }}>
              <PlayIcon size={14} color="#FFF" /> Lecture
            </button>

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
              {heroVideo.genres?.join(" · ") || heroVideo.category?.name || heroVideo.category || ""} — {fmtDuration(heroVideo.duration)} — {heroVideo.rating || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="page-container" style={{
        maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0",
      }}>
        <RecommendationsRow />
      </div>

      {/* Catégories */}
      <div className="page-container" style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 32px 40px",
      }}>
        {categories.length > 0 ? (
          categories.map(c => <CategoryRow key={c.id} category={c} />)
        ) : (
          <div style={{ color: TEXT_S, textAlign: 'center', padding: '40px' }}>
            Chargement des catégories...
          </div>
        )}
      </div>
    </div>
  );
}