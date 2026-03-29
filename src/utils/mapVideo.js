import { catalogueService } from '../services/api';

// ——— Convertit une vidéo API en modèle local ———
export const mapApiVideo = (apiVideo) => ({
  id: apiVideo.id,
  title: apiVideo.title,
  description: apiVideo.description,
  thumbnailUrl: catalogueService.getThumbnailUrl(apiVideo.thumbnailUrl),
  audioUrl: catalogueService.getStreamUrl(apiVideo.id),
  duration: apiVideo.duration || 0,
  releaseDate: new Date(apiVideo.createdAt).getFullYear().toString(),
  rating: 'Tout public', // ← pas dans l'API pour l'instant
  genres: [apiVideo.category?.name || 'Autre'],
  cast: [],
  director: '',
  category: apiVideo.category?.slug || '',
  categoryId: apiVideo.categoryId,
  viewsCount: apiVideo.viewsCount || 0,
  isLocal: false,
});

// ——— Convertit une liste de vidéos API ———
export const mapApiVideos = (apiVideos) =>
  apiVideos.map(mapApiVideo);