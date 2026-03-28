import axios from 'axios';

// ——— Configuration de base ———
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.ivorioci.chalenge14.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ——— Intercepteur request — injecte le JWT ———
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ——— Intercepteur response — gère les erreurs globales ———
api.interceptors.response.use(
  (response) => {
    console.log(`[API]  ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    console.error(`[API]  ${status} ${error.config?.url} — ${error.message}`);

    // Token expiré → essaie de le rafraîchir
    if (status === 401) {
      try {
        await authService.refresh();
        // Rejoue la requête originale
        return api(error.config);
      } catch {
        // Refresh échoué → déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════
// ——— AUTH SERVICE (Node.js API Gateway) ———
// ═══════════════════════════════════════════════
export const authService = {

  // POST /api/auth/register
  register: (data) =>
    api.post('/api/auth/register', {
      email: data.email,
      password: data.password,
      username: data.name,
    }),

  // POST /api/auth/login
  login: (credentials) =>
    api.post('/api/auth/login', credentials),

  // POST /api/auth/refresh
  refresh: () => {
    const token = localStorage.getItem('token');
    return api.post('/api/auth/refresh', { token });
  },

  // GET /api/auth/me
  me: () =>
    api.get('/api/auth/me'),

  // Déconnexion locale
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

// ═══════════════════════════════════════════════
// ——— CATALOGUE SERVICE (Go) ———
// ═══════════════════════════════════════════════
export const catalogueService = {

  // GET /api/videos?category=&genre=&search=&page=
  getVideos: (params = {}) =>
    api.get('/api/videos', { params }),

  // GET /api/videos/:id
  getVideoById: (id) =>
    api.get(`/api/videos/${id}`),

  // GET /api/videos/:id/similar
  getSimilarVideos: (id) =>
    api.get(`/api/videos/${id}/similar`),

  // GET /api/categories
  getCategories: () =>
    api.get('/api/categories'),

  // GET /api/genres
  getGenres: () =>
    api.get('/api/genres'),
};

// ═══════════════════════════════════════════════
// ——— PROFILS SERVICE (Go) ———
// ═══════════════════════════════════════════════
export const profileService = {

  // GET /api/profiles
  getAll: () =>
    api.get('/api/profiles'),

  // POST /api/profiles
  create: (data) =>
    api.post('/api/profiles', {
      name: data.name,
      avatar: data.avatar,
      isKid: data.isKid || false,
    }),

  // PUT /api/profiles/:id
  update: (id, data) =>
    api.put(`/api/profiles/${id}`, data),

  // DELETE /api/profiles/:id
  delete: (id) =>
    api.delete(`/api/profiles/${id}`),

  // POST /api/profiles/:id/switch
  switchProfile: (id) =>
    api.post(`/api/profiles/${id}/switch`),
};

// ═══════════════════════════════════════════════
// ——— WATCHLIST & HISTORIQUE SERVICE (Go) ———
// ═══════════════════════════════════════════════
export const watchlistService = {

  // GET /api/watchlist
  getAll: () =>
    api.get('/api/watchlist'),

  // POST /api/watchlist/:videoId
  add: (videoId) =>
    api.post(`/api/watchlist/${videoId}`),

  // DELETE /api/watchlist/:videoId
  remove: (videoId) =>
    api.delete(`/api/watchlist/${videoId}`),

  // GET /api/history
  getHistory: () =>
    api.get('/api/history'),

  // PUT /api/history/:videoId/progress
  updateProgress: (videoId, currentTime) =>
    api.put(`/api/history/${videoId}/progress`, { currentTime }),
};

// ═══════════════════════════════════════════════
// ——— RECOMMANDATIONS SERVICE (Python) ———
// ═══════════════════════════════════════════════
export const recommendationService = {

  // GET /api/recommendations
  getRecommendations: () =>
    api.get('/api/recommendations'),

  // GET /api/recommendations/trending
  getTrending: () =>
    api.get('/api/recommendations/trending'),

  // GET /api/recommendations/continue
  getContinueWatching: () =>
    api.get('/api/recommendations/continue'),
};

// ═══════════════════════════════════════════════
// ——— STREAMING SERVICE (Go) ———
// ═══════════════════════════════════════════════
export const streamingService = {

  // GET /api/stream/:videoId
  getStream: (videoId) =>
    api.get(`/api/stream/${videoId}`),

  // GET /api/stream/:videoId/manifest
  getManifest: (videoId) =>
    api.get(`/api/stream/${videoId}/manifest`),

  // GET /api/stream/:videoId/segment/:quality/:index
  getSegment: (videoId, quality, index) =>
    api.get(`/api/stream/${videoId}/segment/${quality}/${index}`),

  // URL directe du manifest HLS pour le player
  getManifestUrl: (videoId) =>
    `${import.meta.env.VITE_API_URL || 'https://api.ivorioci.chalenge14.com'}/api/stream/${videoId}/manifest`,
};

export default api;