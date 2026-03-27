import { useState, useEffect, useCallback } from 'react';
import { videos } from '../data/mockData';
import { filterVideos } from '../utils/filterVideos';

const STORAGE_KEY = 'ivorioci_recent_searches';
const MAX_RECENT = 6;

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ——— Charge les recherches récentes depuis localStorage ———
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // ——— Génère les suggestions en temps réel ———
  const generateSuggestions = useCallback((q) => {
    if (q.length < 1) return [];

    const ql = q.toLowerCase();

    // Titres
    const titleMatches = videos
      .filter(v => v.title.toLowerCase().includes(ql))
      .map(v => ({ type: 'title', label: v.title, icon: '🎬' }));

    // Genres
    const genreMatches = [...new Set(videos.flatMap(v => v.genres))]
      .filter(g => g.toLowerCase().includes(ql))
      .map(g => ({ type: 'genre', label: g, icon: '🎭' }));

    // Réalisateurs
    const directorMatches = [...new Set(videos.map(v => v.director))]
      .filter(d => d.toLowerCase().includes(ql))
      .map(d => ({ type: 'director', label: d, icon: '🎥' }));

    // Acteurs
    const castMatches = [...new Set(videos.flatMap(v => v.cast))]
      .filter(c => c.toLowerCase().includes(ql))
      .map(c => ({ type: 'cast', label: c, icon: '👤' }));

    return [...titleMatches, ...genreMatches, ...directorMatches, ...castMatches]
      .slice(0, 5);
  }, []);

  // ——— Mise à jour en temps réel ———
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSuggestions(query.length >= 1 ? generateSuggestions(query) : []);
      return;
    }

    const filtered = filterVideos(videos, query);
    setResults(filtered.slice(0, 6));
    setSuggestions(generateSuggestions(query));
  }, [query]);

  // ——— Sauvegarde une recherche récente ———
  const saveRecentSearch = useCallback((q) => {
    if (!q.trim()) return;
    setRecentSearches(prev => {
      const updated = [q, ...prev.filter(s => s !== q)].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ——— Supprime une recherche récente ———
  const removeRecentSearch = useCallback((q) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== q);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ——— Vide tout l'historique ———
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // ——— Applique une suggestion ou recherche récente ———
  const applySearch = useCallback((q) => {
    setQuery(q);
    saveRecentSearch(q);
  }, [saveRecentSearch]);

  // ——— Valide la recherche (Enter ou clic) ———
  const submitSearch = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setIsOpen(false);
    }
  }, [query, saveRecentSearch]);

  // ——— Ferme le dropdown ———
  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    query, setQuery,
    results, suggestions,
    recentSearches,
    isOpen, setIsOpen,
    applySearch, submitSearch,
    removeRecentSearch, clearRecentSearches,
  };
};