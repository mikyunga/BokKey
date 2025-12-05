'use client';
import { useFavorites } from '../contexts/FavoriteContext';
import PlaceItem from '../components/common/map/PlaceItem';
import { useState } from 'react';

export default function FavoritesPage({ onSelectFromFavorites }) {
  const { favorites } = useFavorites();
  const [mode, setMode] = useState('child');

  const places = favorites[mode] || [];

  const handleSelect = (place) => {
    // 부모(MapPage)로 선택된 장소 전달
    if (onSelectFromFavorites) {
      onSelectFromFavorites(place, mode);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4">즐겨찾기</h2>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-full ${mode === 'child' ? 'bg-green-100 font-medium' : 'bg-gray-200'}`}
          onClick={() => setMode('child')}
        >
          아동급식카드
        </button>
        <button
          className={`px-4 py-2 rounded-full ${mode === 'senior' ? 'bg-green-100 font-medium' : 'bg-gray-200'}`}
          onClick={() => setMode('senior')}
        >
          노인무료급식소
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {places.length === 0 ? (
          <p className="text-gray-400">즐겨찾기가 없습니다.</p>
        ) : (
          places.map((place) => (
            <PlaceItem
              key={place.id}
              place={place}
              mode={mode}
              onSelect={() => handleSelect(place)}
            />
          ))
        )}
      </div>
    </div>
  );
}
