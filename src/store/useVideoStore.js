// store/useVideoStore.js
import { create } from 'zustand';
import { catalogueService } from '../services/api';
import { mapApiVideos } from '../utils/mapVideo';

export const useVideoStore = create((set, get) => ({
  videos: [], // ← NE PAS utiliser les mocks au démarrage
  watchList: [], // ← Initialiser vide
  watchHistory: [], // ← Initialiser vide
  selectedGenreFilter: 'Tous',
  isLoadingVideos: false,
  totalVideos: 0,
  currentPage: 1,

  // ——— Charge les vidéos depuis l'API ———
  loadVideos: async (params = {}) => {
    set({ isLoadingVideos: true });
    try {
      console.log('[VideoStore] Chargement vidéos...');
      const res = await catalogueService.getVideos(params);

      console.log('[VideoStore] Réponse brute:', res);
      
      // Vérifier le format de la réponse
      if (res?.data?.success && res.data.data) {
        // Format: { success: true, data: { items: [...], total, page } }
        const { items, total, page } = res.data.data;
        
        if (items && Array.isArray(items)) {
          const mapped = mapApiVideos(items);
          
          console.log(`[VideoStore] ✅ ${mapped.length} vidéos chargées (total: ${total})`);
          if (mapped.length > 0) {
            console.log('[VideoStore] Première vidéo:', {
              title: mapped[0].title,
              id: mapped[0].id,
              categoryId: mapped[0].categoryId,
              category: mapped[0].category
            });
          }
          
          set({
            videos: mapped,
            totalVideos: total,
            currentPage: page,
            isLoadingVideos: false,
          });
          return mapped;
        } else {
          console.warn('[VideoStore] Aucun item dans la réponse');
          set({ isLoadingVideos: false });
          return [];
        }
      } else {
        console.warn('[VideoStore] Format de réponse inattendu:', res);
        set({ isLoadingVideos: false });
        return [];
      }
    } catch (err) {
      console.error('[VideoStore] ❌ Erreur:', err.message);
      set({ isLoadingVideos: false });
      return [];
    }
  },

  // ——— Charge les vidéos d'une catégorie ———
  loadCategoryVideos: async (categoryId, params = {}) => {
    set({ isLoadingVideos: true });
    try {
      console.log(`[VideoStore] Chargement vidéos catégorie: ${categoryId}`);
      const res = await catalogueService.getCategoryVideos(categoryId, params);

      if (res?.data?.success && res.data.data) {
        const { items, total } = res.data.data;
        if (items && Array.isArray(items)) {
          const mapped = mapApiVideos(items);
          console.log(`[VideoStore] ✅ ${mapped.length} vidéos catégorie (total: ${total})`);
          set({ videos: mapped, totalVideos: total, isLoadingVideos: false });
          return mapped;
        }
      }
      set({ isLoadingVideos: false });
      return [];
    } catch (err) {
      console.error('[VideoStore] ❌ Erreur catégorie:', err.message);
      set({ isLoadingVideos: false });
      return [];
    }
  },

  toggleWatchList: (videoId) => set((state) => ({
    watchList: state.watchList.includes(videoId)
      ? state.watchList.filter(id => id !== videoId)
      : [...state.watchList, videoId],
  })),

  setGenreFilter: (genre) => set({ selectedGenreFilter: genre }),

  getProgress: (videoId) => {
    const h = get().watchHistory.find(w => w.videoId === videoId);
    return h ? h.percentage : 0;
  },

  getVideoById: (id) => get().videos.find(v => v.id === id),

  getSimilarVideos: (video) =>
    get().videos
      .filter(v => v.id !== video.id && v.genres.some(g => video.genres?.includes(g)))
      .slice(0, 4),
}));