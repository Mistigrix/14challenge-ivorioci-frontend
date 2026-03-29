// utils/mapVideo.js
import { catalogueService } from '../services/api';

// ——— Convertit une vidéo API en modèle local ———
export const mapApiVideo = (apiVideo) => ({
  id: apiVideo.id,
  title: apiVideo.title,
  description: apiVideo.description,
  thumbnailUrl: apiVideo.thumbnailUrl, // Garder l'URL telle quelle
  thumbnailUrlFull: apiVideo.thumbnailUrl ? catalogueService.getThumbnailUrl(apiVideo.thumbnailUrl) : null,
  audioUrl: catalogueService.getStreamUrl(apiVideo.id),
  duration: apiVideo.duration || 0,
  releaseDate: new Date(apiVideo.createdAt).getFullYear().toString(),
  rating: 'Tout public',
  genres: [apiVideo.category?.name || 'Autre'],
  cast: [],
  director: '',
  category: apiVideo.category?.slug || '',
  categoryId: apiVideo.categoryId,
  categoryName: apiVideo.category?.name,
  viewsCount: apiVideo.viewsCount || 0,
  createdAt: apiVideo.createdAt,
  isLocal: false,
});

// ——— Convertit une liste de vidéos API ———
export const mapApiVideos = (apiVideos) =>
  apiVideos.map(mapApiVideo);