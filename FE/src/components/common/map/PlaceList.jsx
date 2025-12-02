'use client';

import { Clock, ShoppingBag, SlidersHorizontal } from 'lucide-react'; // ✅ 아이콘 추가
import { CHILD_PLACES, SENIOR_PLACES } from '../../../constants/mockData';
import PlaceItem from './PlaceItem';

export default function PlaceList({ mode, selectedFilters, searchQuery }) {
  const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

  // 필터링 로직
  const filteredPlaces = places.filter((place) => {
    // 검색어 필터
    if (searchQuery && !place.name.includes(searchQuery)) return false;

    // 카테고리 필터 (아동일 때만 적용)
    if (mode === 'child' && selectedFilters.length > 0) {
      if (!selectedFilters.includes(place.category)) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {/* 상단 헤더 & 필터 버튼 */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-base">검색 결과</h3>

          <div className="flex items-center gap-2 text-sm text-gray-stroke60">
            {/* 1. 공통: 영업중 (시계 아이콘) */}
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              <Clock className="w-4 h-4" />
              <span>영업중</span>
            </button>

            {/* 2. 모드별 분기 */}
            {mode === 'child' ? (
              // 아동 모드: 배달가능 (쇼핑백 아이콘)
              <button className="flex items-center gap-1 hover:text-black transition-colors">
                <ShoppingBag className="w-4 h-4" />
                <span>배달가능</span>
              </button>
            ) : (
              // 노인 모드: 상세조건 (설정/슬라이더 아이콘)
              <button className="flex items-center gap-1 hover:text-black transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                <span>상세조건</span>
              </button>
            )}
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
