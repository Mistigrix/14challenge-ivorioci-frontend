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

  // POST /auth/register
  register: (data) =>
    api.post('/auth/register', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    }),

  // POST /auth/login
  login: (credentials) =>
    api.post('/auth/login', credentials),

  
  // POST /auth/refresh
  refresh: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('[Auth] Refresh avec token:', refreshToken?.substring(0, 30) + '...');
    return api.post('/auth/refresh', { refreshToken });
  },

  // GET /auth/me
  me: () => api.get('/auth/me'),

  // Déconnexion locale
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

// ═══════════════════════════════════════════════
// ——— CATALOGUE SERVICE (Go) ———
// ═══════════════════════════════════════════════
// export const catalogueService = {

//   // GET /api/videos?category=&genre=&search=&page=
//   getVideos: (params = {}) =>
//     api.get('/api/videos', { params }),

//   // GET /api/videos/:id
//   getVideoById: (id) =>
//     api.get(`/api/videos/${id}`),

//   // GET /api/videos/:id/similar
//   getSimilarVideos: (id) =>
//     api.get(`/api/videos/${id}/similar`),

//   // GET /api/categories
//   getCategories: () =>
//     api.get('/api/categories'),

//   // GET /api/genres
//   getGenres: () =>
//     api.get('/api/genres'),
// };

export const catalogueService = {

  // ——— CATÉGORIES ———

  // GET /api/categories
  getCategories: () => {
    console.log('[Catalogue] GET /api/categories');
    return api.get('/api/categories');
  },

  // GET /api/categories/:id
  getCategoryById: (categoryId) => {
    console.log(`[Catalogue] GET /api/categories/${categoryId}`);
    return api.get(`/api/categories/${categoryId}`);
  },

  // GET /api/categories/:id/videos
  getCategoryVideos: (categoryId, params = {}) => {
    console.log(`[Catalogue] GET /api/categories/${categoryId}/videos`, params);
    return api.get(`/api/categories/${categoryId}/videos`, { params });
  },

  // ——— VIDÉOS ———

  // GET /api/videos?page=1&limit=20&search=&categoryId=&sortBy=created_at&sortOrder=desc
  getVideos: (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 20,
      search: '',
      categoryId: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      ...params,
    };
    console.log('[Catalogue] GET /api/videos', defaultParams);
    return api.get('/api/videos', { params: defaultParams });
  },

  // GET /api/videos/:id
  getVideoById: (id) => {
    console.log(`[Catalogue] GET /api/videos/${id}`);
    return api.get(`/api/videos/${id}`);
  },

  // GET /api/videos/:id/similar
  getSimilarVideos: (id) => {
    console.log(`[Catalogue] GET /api/videos/${id}/similar`);
    return api.get(`/api/videos/${id}/similar`);
  },

  // ——— THUMBNAIL ———

  // GET /api/thumbnails/:filename
  // Retourne l'URL complète de la thumbnail
  getThumbnailUrl: (thumbnailUrl) => {
    if (!thumbnailUrl) return null;
    // Si déjà une URL complète → retourne telle quelle
    if (thumbnailUrl.startsWith('http')) return thumbnailUrl;
    // Sinon construit l'URL
    const base = import.meta.env.VITE_API_URL || 'https://api.ivorioci.chalenge14.com';
    return `${base}/api/thumbnails/${thumbnailUrl}`;
  },

  // ——— STREAMING ———

  // GET /api/stream/:videoId
  // Retourne l'URL du stream directement utilisable dans un <video>
  getStreamUrl: (videoId) => {
    const base = import.meta.env.VITE_API_URL || 'https://api.ivorioci.chalenge14.com';
    return `${base}/api/stream/${videoId}`;
  },

  // GET /api/genres
  getGenres: () => {
    console.log('[Catalogue] GET /api/genres');
    return api.get('/api/genres');
  },
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