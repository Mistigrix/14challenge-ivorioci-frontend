import { create } from 'zustand';
import { videos } from '../data/mockData';

// ——— Algorithme de recommandation local ———
// Simule le service Python en attendant l'API réelle

const getTopGenres = (watchHistory, allVideos) => {
  const genreCount = {};

  watchHistory.forEach(h => {
    const video = allVideos.find(v => v.id === h.videoId);
    if (video) {
      video.genres.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + (h.percentage / 100);
      });
    }
  });

  return Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);
};

const scoreVideo = (video, topGenres, watchHistory, watchList) => {
  let score = 0;

  // +3 par genre aimé
  video.genres.forEach(g => {
    const idx = topGenres.indexOf(g);
    if (idx !== -1) score += 3 - idx * 0.5;
  });

  // -5 si déjà vu à 100%
  const history = watchHistory.find(h => h.videoId === video.id);
  if (history?.percentage === 100) score -= 5;

  // +1 si dans la watchlist
  if (watchList.includes(video.id)) score += 1;

  // +2 si récent (2026)
  if (video.releaseDate === '2026') score += 2;

  return score;
};

export const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  trending: [],
  continueWatching: [],
  isLoading: false,

  // ——— Génère les recommandations localement ———
  generateRecommendations: (watchHistory, watchList, isKid = false) => {
    set({ isLoading: true });

    const topGenres = getTopGenres(watchHistory, videos);

    // Filtre contenu enfant si profil kid
    const availableVideos = isKid
      ? videos.filter(v => v.rating === 'Tout public')
      : videos;

    // Score chaque vidéo
    const scored = availableVideos
      .map(v => ({ video: v, score: scoreVideo(v, topGenres, watchHistory, watchList) }))
      .sort((a, b) => b.score - a.score);

    // Top recommandations — exclut les 100% vus
    const recommendations = scored
      .filter(({ video }) => {
        const h = watchHistory.find(w => w.videoId === video.id);
        return !h || h.percentage < 100;
      })
      .slice(0, 6)
      .map(({ video }) => video);

    // Tendances — les plus récents avec bon score
    const trending = availableVideos
      .filter(v => v.category === 'tendances' || v.releaseDate === '2026')
      .slice(0, 6);

    // Reprendre le visionnage — entre 5% et 99%
    const continueWatching = watchHistory
      .filter(h => h.percentage > 5 && h.percentage < 100)
      .map(h => availableVideos.find(v => v.id === h.videoId))
      .filter(Boolean)
      .slice(0, 4);

    set({ recommendations, trending, continueWatching, isLoading: false });
  },

  // ——— Fetch depuis l'API Python ———
  fetchFromApi: async (profileId) => {
    set({ isLoading: true });
    try {
      // TODO: remplace par l'URL réelle
      // const res = await api.get(`/recommendations?profileId=${profileId}`);
      // set({ recommendations: res.data.recommendations, trending: res.data.trending });
      console.log('[RecommendationStore] API non encore connectée — mode local');
    } catch (e) {
      console.error('[RecommendationStore] Erreur API:', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));