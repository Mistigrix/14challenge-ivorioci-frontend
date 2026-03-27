import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.ivorioci.chalenge14.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur request — ajoute le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur response — gère les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const videoService = {
  getAll:      ()     => api.get('/videos'),
  getById:     (id)   => api.get(`/videos/${id}`),
  getStream:   (id)   => api.get(`/videos/${id}/stream`),
  search:      (q)    => api.get(`/videos/search?q=${q}`),
};

export const profileService = {
  getAll:  ()       => api.get('/profiles'),
  create:  (data)   => api.post('/profiles', data),
  delete:  (id)     => api.delete(`/profiles/${id}`),
};

export const watchListService = {
  getAll:  ()       => api.get('/watchlist'),
  add:     (id)     => api.post(`/watchlist/${id}`),
  remove:  (id)     => api.delete(`/watchlist/${id}`),
};

export default api;