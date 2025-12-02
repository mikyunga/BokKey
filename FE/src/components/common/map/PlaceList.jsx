'use client';

import { CHILD_PLACES, SENIOR_PLACES } from '../../../constants/mockData';
import PlaceItem from './PlaceItem';

export default function PlaceList({ mode, selectedFilters, searchQuery }) {
  const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

  // 필터링 로직
  const filteredPlaces = places.filter((place) => {
    // 검색어 필터
    if (searchQuery && !place.name.includes(searchQuery)) return false;

    // 카테고리 필터 (아동일 때만)
    if (mode === 'child' && selectedFilters.length > 0) {
      if (!selectedFilters.includes(place.category)) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-base">검색 결과</h3>
          <div className="flex items-center gap-2 text-sm text-gray-stroke60">
            <button className="hover:text-black">영업중</button>
            <span className="text-gray-stroke30">|</span>
            <button className="hover:text-black">배달가능</button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredPlaces.map((place) => (
            <PlaceItem key={place.id} place={place} mode={mode} />
          ))}
        </div>
      </div>
    </div>
  );
}
