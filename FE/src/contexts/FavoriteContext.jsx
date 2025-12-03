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
      if (exists) {
        const updatedList = list.filter((p) => p.id !== place.id);
        return { ...prev, [mode]: updatedList };
      } else {
        const minimalPlace = {
          id: place.id,
          name: place.name,
          address: place.address,
          phone: place.phone,
          category: place.category,
          type: place.type,
          isOpen: place.isOpen,
          delivery: place.delivery,
          schedule: place.schedule,
        };
        const updatedList = [...list, minimalPlace];
        return { ...prev, [mode]: updatedList };
      }
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
