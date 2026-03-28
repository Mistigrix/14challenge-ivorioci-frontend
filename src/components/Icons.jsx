// Icones SVG natives — remplace les emojis par des icones propres
const Icon = ({ d, size = 16, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }} {...props}>
    <path d={d} />
  </svg>
);

// Icone avec remplissage (fill) au lieu de stroke
const FillIcon = ({ children, size = 16, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
    style={{ flexShrink: 0 }} {...props}>
    {children}
  </svg>
);

export const SearchIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const CloseIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

export const MenuIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18" />
    <path d="M3 6h18" />
    <path d="M3 18h18" />
  </svg>
);

export const PlayIcon = ({ size = 16, color = 'currentColor' }) => (
  <FillIcon size={size} color={color}>
    <polygon points="5,3 19,12 5,21" />
  </FillIcon>
);

export const PauseIcon = ({ size = 16, color = 'currentColor' }) => (
  <FillIcon size={size} color={color}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </FillIcon>
);

export const SkipBackIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
    stroke="none" style={{ flexShrink: 0 }}>
    <rect x="3" y="5" width="3" height="14" />
    <polygon points="20,5 8,12 20,19" />
  </svg>
);

export const SkipForwardIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
    stroke="none" style={{ flexShrink: 0 }}>
    <rect x="18" y="5" width="3" height="14" />
    <polygon points="4,5 16,12 4,19" />
  </svg>
);

export const FullscreenIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 00-2 2v3" />
    <path d="M21 8V5a2 2 0 00-2-2h-3" />
    <path d="M3 16v3a2 2 0 002 2h3" />
    <path d="M16 21h3a2 2 0 002-2v-3" />
  </svg>
);

export const StarIcon = ({ size = 16, color = 'currentColor', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? color : 'none'} stroke={color} strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

export const ClockIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const FilterIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
);

export const ChevronUpIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

export const FilmIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <path d="M7 2v20" />
    <path d="M17 2v20" />
    <path d="M2 12h20" />
    <path d="M2 7h5" />
    <path d="M2 17h5" />
    <path d="M17 17h5" />
    <path d="M17 7h5" />
  </svg>
);

export const CheckIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
