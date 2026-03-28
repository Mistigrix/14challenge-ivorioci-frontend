// Systeme de notifications toast avec animation et gestion d'etat via Zustand
// Supporte trois types : success (vert), info (orange), error (rouge)
// Disparait automatiquement apres 2.5 secondes

import { create } from 'zustand';
import { CheckIcon, StarIcon, CloseIcon } from './Icons';

// Store Zustand pour gerer l'affichage des toasts
export const useToastStore = create((set) => ({
  toast: null,
  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), 2500);
  },
}));

// Couleurs associees a chaque type de notification
const typeColors = {
  success: '#009E49',
  info: '#FF8C00',
  error: '#E53935',
};

// Icones associees a chaque type de notification
const typeIcons = {
  success: <CheckIcon />,
  info: <StarIcon />,
  error: <CloseIcon />,
};

export default function Toast() {
  const toast = useToastStore((state) => state.toast);

  if (!toast) return null;

  const borderColor = typeColors[toast.type] || typeColors.info;
  const icon = typeIcons[toast.type] || typeIcons.info;

  return (
    <>
      {/* Animation d'entree (slideUp) et de sortie (slideDown) */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
      <div
        key={toast.id}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1A1A22',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ color: borderColor, display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
        <span>{toast.message}</span>
      </div>
    </>
  );
}
