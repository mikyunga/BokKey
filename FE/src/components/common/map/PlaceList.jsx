'use client';

import { Clock, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import PlaceItem from './PlaceItem';

export default function PlaceList({ mode, places }) {
  // props로 받은 places(이미 필터링됨)를 그대로 사용

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-base">검색 결과 ({places.length})</h3>

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
          {places.map((place) => (
            <PlaceItem key={place.id} place={place} mode={mode} />
          ))}
          {places.length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm">
              조건에 맞는 장소가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
