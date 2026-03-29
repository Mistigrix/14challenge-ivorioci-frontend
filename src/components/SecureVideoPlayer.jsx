// components/SecureVideoPlayer.jsx
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { catalogueService } from '../services/api';

const CI_O = '#FF8C00';
const TEXT_P = '#F0EDE6';

const SecureVideoPlayer = forwardRef(({ videoId, autoPlay = false, onTimeUpdate, onEnded, onLoadedMetadata }, ref) => {
  const [streamUrl, setStreamUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const isFirstLoad = useRef(true);
  const loadInProgress = useRef(false);

  // Exposer la référence vidéo au parent
  useImperativeHandle(ref, () => videoRef.current);

  // Fonction de rafraîchissement du token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('[SecureVideoPlayer] Pas de refresh token');
        return false;
      }
      
      const response = await fetch('https://api.ivorioci.chalenge14.com/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success && data.data) {
        localStorage.setItem('token', data.data.accessToken);
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        console.log('[SecureVideoPlayer] ✅ Token rafraîchi');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SecureVideoPlayer] Erreur refresh:', error);
      return false;
    }
  };

  // Fonction pour charger la vidéo
  const loadVideoWithToken = async (retryCount = 0) => {
    // Éviter les chargements multiples simultanés
    if (loadInProgress.current) {
      console.log('[SecureVideoPlayer] Chargement déjà en cours, ignoré');
      return;
    }
    
    loadInProgress.current = true;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié - Veuillez vous connecter');
      }
      
      const streamUrl = catalogueService.getStreamUrl(videoId);
      console.log('[SecureVideoPlayer] Chargement vidéo:', videoId);
      
      const response = await fetch(streamUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('[SecureVideoPlayer] Status:', response.status);
      
      if (response.status === 401 && retryCount === 0) {
        console.log('[SecureVideoPlayer] Token expiré, tentative refresh...');
        const refreshSuccess = await refreshToken();
        
        if (refreshSuccess) {
          console.log('[SecureVideoPlayer] Refresh réussi, nouvelle tentative...');
          loadInProgress.current = false;
          return loadVideoWithToken(retryCount + 1);
        } else {
          throw new Error('Session expirée, veuillez vous reconnecter');
        }
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Nettoyer l'ancienne URL
      if (streamUrl && streamUrl !== url) {
        URL.revokeObjectURL(streamUrl);
      }
      
      setStreamUrl(url);
      console.log('[SecureVideoPlayer] ✅ Vidéo chargée, taille:', blob.size);
      
    } catch (err) {
      console.error('[SecureVideoPlayer] ❌ Erreur:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
      loadInProgress.current = false;
    }
  };

  // Charger la vidéo quand l'ID change
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    loadVideoWithToken();
    isFirstLoad.current = true;
    
    return () => {
      if (streamUrl) {
        URL.revokeObjectURL(streamUrl);
      }
    };
  }, [videoId]);

  // Gérer l'autoPlay après le chargement (éviter les conflits)
  useEffect(() => {
    if (videoRef.current && !isLoading && streamUrl) {
      // S'assurer que la vidéo est complètement chargée avant de jouer
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        if (autoPlay && isFirstLoad.current) {
          video.play()
            .then(() => {
              console.log('[SecureVideoPlayer] Lecture démarrée');
              isFirstLoad.current = false;
            })
            .catch(e => {
              console.log('[SecureVideoPlayer] AutoPlay bloqué:', e.message);
              isFirstLoad.current = false;
            });
        }
        video.removeEventListener('canplay', handleCanPlay);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      // Si la vidéo est déjà prête
      if (video.readyState >= 3) {
        handleCanPlay();
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [autoPlay, isLoading, streamUrl]);

  if (isLoading) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{
          width: 40, height: 40,
          border: `3px solid ${CI_O}20`,
          borderTop: `3px solid ${CI_O}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ color: TEXT_P, fontSize: 14 }}>Chargement de la vidéo...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ color: '#ff6b6b', fontSize: 14, textAlign: 'center', maxWidth: 300 }}>
          {error}
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: CI_O,
            color: '#FFF',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600
          }}>
          Se reconnecter
        </button>
      </div>
    );
  }

  if (!streamUrl) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000'
      }}>
        <div style={{ color: TEXT_P }}>Aucune vidéo disponible</div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={streamUrl}
      preload="auto"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        backgroundColor: '#000'
      }}
      onTimeUpdate={(e) => {
        if (onTimeUpdate) onTimeUpdate(e);
      }}
      onEnded={(e) => {
        if (onEnded) onEnded(e);
      }}
      onLoadedMetadata={(e) => {
        console.log('[SecureVideoPlayer] Métadonnées chargées');
        if (onLoadedMetadata) onLoadedMetadata(e);
      }}
      onPlay={() => console.log('[SecureVideoPlayer] Lecture démarrée')}
      onPause={() => console.log('[SecureVideoPlayer] Lecture en pause')}
    />
  );
});

SecureVideoPlayer.displayName = 'SecureVideoPlayer';

export default SecureVideoPlayer;