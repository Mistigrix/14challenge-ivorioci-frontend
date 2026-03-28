import { create } from 'zustand';
import { videos } from '../data/mockData';
import { useToastStore } from '../components/Toast';

export const useVideoStore = create((set, get) => ({
  videos,
  watchList: [2, 6, 10],
  watchHistory: [
    { videoId: 1, watchedDuration: 3200, percentage: 59 },
    { videoId: 3, watchedDuration: 5700, percentage: 100 },
    { videoId: 5, watchedDuration: 900,  percentage: 50  },
    { videoId: 9, watchedDuration: 600,  percentage: 25  },
  ],
  selectedGenreFilter: 'Tous',

  toggleWatchList: (videoId) => {
    const isInList = get().watchList.includes(videoId);
    const video = get().videos.find(v => v.id === videoId);
    const title = video ? video.title : 'Vidéo';

    set((state) => ({
      watchList: isInList
        ? state.watchList.filter(id => id !== videoId)
        : [...state.watchList, videoId],
    }));

    // Notification toast
    const { showToast } = useToastStore.getState();
    if (isInList) {
      showToast(`${title} retiré de ma liste`, 'info');
    } else {
      showToast(`${title} ajouté à ma liste`, 'success');
    }
  },

  setGenreFilter: (genre) => set({ selectedGenreFilter: genre }),

  getProgress: (videoId) => {
    const h = get().watchHistory.find(w => w.videoId === videoId);
    return h ? h.percentage : 0;
  },

  getVideoById: (id) => get().videos.find(v => v.id === id),

  getSimilarVideos: (video) =>
    get().videos
      .filter(v => v.id !== video.id && v.genres.some(g => video.genres.includes(g)))
      .slice(0, 4),
}));