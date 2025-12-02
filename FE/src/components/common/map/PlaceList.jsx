'use client';

import { Clock, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { CHILD_PLACES, SENIOR_PLACES } from '../../../constants/mockData';
import { REGIONS } from '../../../constants/region';
import PlaceItem from './PlaceItem';

export default function PlaceList({ mode, selectedFilters, searchQuery, sido, sigungu }) {
  const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

  // 필터링 로직
  const filteredPlaces = places.filter((place) => {
    // 1. 검색어 필터
    if (searchQuery && !place.name.includes(searchQuery)) return false;

    // 2. 카테고리 필터 (아동일 때만 적용)
    if (mode === 'child' && selectedFilters.length > 0) {
      if (!selectedFilters.includes(place.category)) return false;
    }

    // 3. ✅ 지역 필터 (Sido / Sigungu) - 수정된 부분
    if (sido) {
      const targetRegionCodes = REGIONS.filter(
        (r) => r.province === sido && (!sigungu || r.district === sigungu)
      ).map((r) => r.region_code);

      // 데이터에 지역 코드가 없거나, 선택된 지역 코드 목록에 포함되지 않으면 제외
      // Number()를 사용하여 문자열/숫자 타입 불일치 방지
      if (!place.region_code || !targetRegionCodes.includes(Number(place.region_code))) {
        return false;
      }
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
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              <Clock className="w-4 h-4" />
              <span>영업중</span>
            </button>

            {mode === 'child' ? (
              <button className="flex items-center gap-1 hover:text-black transition-colors">
                <ShoppingBag className="w-4 h-4" />
                <span>배달가능</span>
              </button>
            ) : (
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
          {/* 결과가 없을 때 안내 메시지 */}
          {filteredPlaces.length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm">검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
