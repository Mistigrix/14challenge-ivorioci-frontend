import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  selectedVideo: null,
  isPlaying: false,
  playerTime: 0,
  playerQuality: 'auto',
  playbackSpeed: 1,

  setVideo: (video) => set({
    selectedVideo: video,
    playerTime: 0,
    isPlaying: true,
  }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlayerTime: (time) => set({ playerTime: time }),
  setQuality: (q) => set({ playerQuality: q }),
  setSpeed: (s) => set({ playbackSpeed: s }),
  stop: () => set({ isPlaying: false, selectedVideo: null, playerTime: 0 }),
}));