// src/contexts/FavoriteContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : { child: [], senior: [] };
    } catch {
      return { child: [], senior: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (place, mode) => {
    setFavorites((prev) => {
      const list = prev[mode] || [];
      const exists = list.find((p) => p.id === place.id);
      const updatedList = exists ? list.filter((p) => p.id !== place.id) : [...list, place];
      return { ...prev, [mode]: updatedList };
    });
  };

  const isFavorite = (placeId, mode) => {
    return favorites[mode]?.some((p) => p.id === placeId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
