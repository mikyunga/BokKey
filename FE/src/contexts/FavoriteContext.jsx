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
        // 🛠️ 디버깅용 로그: 저장하려는 데이터에 좌표가 있는지 확인
        if (!place.latitude || !place.longitude) {
          console.warn('⚠️ 즐겨찾기 추가 경고: 좌표 데이터가 없습니다!', place);
        }

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
          // 혹시 원본 데이터 키값이 lat/lng, y/x 등으로 다를 경우를 대비한 방어 코드
          latitude: place.latitude || place.lat || place.y,
          longitude: place.longitude || place.lng || place.x,
          target_name: place.target_name, // 노인 급식소 등을 위해 추가 권장
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
