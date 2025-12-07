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
        // 이미 있으면 삭제 (즐겨찾기 해제)
        const updatedList = list.filter((p) => p.id !== place.id);
        return { ...prev, [mode]: updatedList };
      } else {
        // 없으면 추가

        // ⭐ [핵심 수정] 필드를 일일이 나열하지 않고 전체(...place)를 저장합니다.
        // 이렇게 하면 급식소 정보, 운영 시간 등 모든 데이터가 누락 없이 저장됩니다.
        const savedPlace = {
          ...place,
        };

        const updatedList = [...list, savedPlace];
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
