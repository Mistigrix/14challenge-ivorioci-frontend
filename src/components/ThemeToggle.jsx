// Bouton de basculement entre theme sombre et clair
// Persiste le choix dans le localStorage sous la cle 'theme'
// Ajoute ou retire la classe 'light-theme' sur l'element racine du document

import { useEffect } from 'react';
import { create } from 'zustand';

// Lecture du theme initial depuis le localStorage (sombre par defaut)
const initialTheme = typeof window !== 'undefined'
  ? localStorage.getItem('theme') || 'dark'
  : 'dark';

// Store Zustand pour gerer le theme courant
export const useThemeStore = create((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
}));

// Icone soleil affichee en mode sombre (cliquer pour passer en clair)
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

// Icone lune affichee en mode clair (cliquer pour passer en sombre)
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  // Synchronise la classe CSS sur l'element racine a chaque changement de theme
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Basculer le theme"
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '1px solid #2A2A35',
        background: 'transparent',
        color: '#777',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
