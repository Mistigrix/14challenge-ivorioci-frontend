/**
 * Composant de chargement squelette pour VideoCard.
 * Affiche un placeholder animé avec effet de pulsation
 * en attendant le chargement des données vidéo.
 */
export default function SkeletonCard({ size = 'medium' }) {
  // Dimensions identiques à celles de VideoCard
  const dimensions = {
    large:  { w: 320, h: 180 },
    medium: { w: 240, h: 135 },
    small:  { w: 180, h: 100 },
  };
  const { w, h } = dimensions[size] || dimensions.medium;

  // Couleur de fond des blocs squelettes
  const skeletonColor = '#2A2A35';

  // Style commun pour les blocs animés
  const pulseBlock = (extraStyle) => ({
    background: skeletonColor,
    borderRadius: 4,
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
    ...extraStyle,
  });

  return (
    <div style={{ width: w, minWidth: 0, flexShrink: 0 }}>
      {/* Animation de pulsation */}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Zone de la miniature */}
      <div
        style={{
          width: '100%',
          height: h,
          borderRadius: 12,
          background: skeletonColor,
          marginBottom: 10,
          animation: 'skeletonPulse 1.5s ease-in-out infinite',
        }}
      />

      {/* Zone des informations textuelles */}
      <div
        style={{
          background: '#1A1A22',
          border: '1px solid #2A2A35',
          borderRadius: 8,
          padding: '8px 10px',
        }}
      >
        {/* Ligne du titre */}
        <div style={pulseBlock({ width: '85%', height: 14, marginBottom: 8 })} />

        {/* Ligne du genre */}
        <div style={pulseBlock({ width: '60%', height: 11, marginBottom: 6 })} />

        {/* Ligne de la date */}
        <div style={pulseBlock({ width: '40%', height: 10 })} />
      </div>
    </div>
  );
}
