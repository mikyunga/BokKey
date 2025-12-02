'use client';

import { Clock, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import PlaceItem from './PlaceItem';

// ✅ 퀵 필터 상태를 props로 받습니다.
export default function PlaceList({
  mode,
  places,
  selectedPlace,
  onSelectPlace,
  showOpenOnly,
  setShowOpenOnly,
  showDeliveryOnly,
  setShowDeliveryOnly,
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-base">검색 결과</h3>

          <div className="flex items-center gap-2 text-sm">
            {/* ✅ 1. 영업중 버튼 (공통) */}
            <button
              onClick={() => setShowOpenOnly((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium transition-colors 
                ${
                  showOpenOnly
                    ? 'bg-main text-white'
                    : 'bg-gray-stroke03 text-gray-stroke60 hover:bg-gray-stroke05'
                }`}
            >
              <Clock className="w-4 h-4" />
              <span>영업중</span>
            </button>

            {/* ✅ 2. 배달가능 / 상세조건 버튼 (모드별 분기) */}
            {mode === 'child' ? (
              // 아동 모드: 배달가능 필터
              <button
                onClick={() => setShowDeliveryOnly((prev) => !prev)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium transition-colors 
                  ${
                    showDeliveryOnly
                      ? 'bg-main text-white'
                      : 'bg-gray-stroke03 text-gray-stroke60 hover:bg-gray-stroke05'
                  }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>배달가능</span>
              </button>
            ) : (
              // 노인 모드: 상세조건 (필터링 로직은 없지만 UI는 유지)
              <button className="flex items-center gap-1 px-2 py-1 rounded-full font-medium bg-gray-stroke03 text-gray-stroke60 hover:bg-gray-stroke05 cursor-default">
                <SlidersHorizontal className="w-4 h-4" />
                <span>상세조건</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {places.map((place) => (
            <PlaceItem
              key={place.id}
              place={place}
              mode={mode}
              isSelected={selectedPlace && selectedPlace.id === place.id}
              onSelect={onSelectPlace}
            />
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
