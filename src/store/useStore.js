import { create } from 'zustand';
import { videos, profiles } from '../data/mockData';

export const useStore = create((set, get) => ({
  // ——— Profils ———
  currentProfile: profiles[0],
  setCurrentProfile: (profile) => set({ currentProfile: profile }),

  // ——— Vidéo ———
  selectedVideo: null,
  setSelectedVideo: (video) => set({ selectedVideo: video }),

  // ——— Player ———
  isPlaying: false,
  setIsPlaying: (val) => set({ isPlaying: val }),
  playerTime: 0,
  setPlayerTime: (val) => set({ playerTime: val }),
  playerQuality: 'auto',
  setPlayerQuality: (val) => set({ playerQuality: val }),
  playbackSpeed: 1,
  setPlaybackSpeed: (val) => set({ playbackSpeed: val }),

  // ——— Recherche ———
  searchQuery: '',
  searchResults: [],
  handleSearch: (q) => {
    const results = q.length > 1
      ? videos.filter(v =>
          v.title.toLowerCase().includes(q.toLowerCase()) ||
          v.description.toLowerCase().includes(q.toLowerCase()) ||
          v.genres.some(g => g.toLowerCase().includes(q.toLowerCase()))
        )
      : [];
    set({ searchQuery: q, searchResults: results });
  },
  clearSearch: () => set({ searchQuery: '', searchResults: [] }),

  // ——— Watch list ———
  watchList: [2, 6, 10],
  toggleWatchList: (videoId) => set((state) => ({
    watchList: state.watchList.includes(videoId)
      ? state.watchList.filter(id => id !== videoId)
      : [...state.watchList, videoId],
  })),

  // ——— Historique ———
  watchHistory: [
    { videoId: 1, watchedDuration: 3200, percentage: 59 },
    { videoId: 3, watchedDuration: 5700, percentage: 100 },
    { videoId: 5, watchedDuration: 900, percentage: 50 },
    { videoId: 9, watchedDuration: 600, percentage: 25 },
  ],
  getProgress: (videoId) => {
    const h = get().watchHistory.find(w => w.videoId === videoId);
    return h ? h.percentage : 0;
  },

  // ——— Filtre genre ———
  selectedGenreFilter: 'Tous',
  setSelectedGenreFilter: (genre) => set({ selectedGenreFilter: genre }),

  // ——— Actions ———
  playVideo: (video, navigate) => {
    set({
      selectedVideo: video,
      playerTime: 0,
      isPlaying: true,
    });
    navigate(`/player/${video.id}`);
  },
}));