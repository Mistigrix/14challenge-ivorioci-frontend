// components/VideoThumbnail.jsx
import { useState, useEffect } from 'react';
import { catalogueService } from '../services/api';

export default function VideoThumbnail({ videoId, thumbnailUrl, title, className, style }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!thumbnailUrl) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError(true);
          setIsLoading(false);
          return;
        }

        const url = catalogueService.getThumbnailUrl(thumbnailUrl);
        console.log('[VideoThumbnail] Chargement:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
        
      } catch (err) {
        console.error('[VideoThumbnail] ❌ Erreur:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadThumbnail();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [thumbnailUrl]);

  if (isLoading) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          background: 'linear-gradient(135deg, #1A1A22, #131318)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          width: 30, height: 30,
          border: '2px solid rgba(255,140,0,0.2)',
          borderTop: `2px solid ${CI_O}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          background: 'linear-gradient(135deg, #1A1A22, #131318)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ fontSize: 32 }}>🎬</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={className}
      style={style}
    />
  );
}