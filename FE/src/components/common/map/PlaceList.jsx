'use client';

import { useRef, useEffect } from 'react';
import { Clock, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import PlaceItem from './PlaceItem';

export default function PlaceList({
  mode,
  places,
  selectedPlace,
  onSelectPlace, // Sidebar에서 넘어온 setSelectedPlace
  showOpenOnly,
  setShowOpenOnly,
  showDeliveryOnly,
  setShowDeliveryOnly,
  onOpenFilter,
  onHeaderHeightChange,
  detailFilterActive,
  setDetailFilterActive,
}) {
  const filterButtonRef = useRef(null);
  const headerRef = useRef(null);

  // ⭐ [핵심] 각 아이템의 위치를 저장할 ref
  const itemRefs = useRef({});

  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(headerRef.current?.offsetHeight || 0);
    }
  }, []);

  // ⭐ [핵심] selectedPlace가 바뀌면 해당 위치로 스크롤
  useEffect(() => {
    if (selectedPlace && itemRefs.current[selectedPlace.id]) {
      itemRefs.current[selectedPlace.id].scrollIntoView({
        behavior: 'smooth',
        block: 'center', // 화면 중앙으로 오게 함
      });
    }
  }, [selectedPlace]);

  const handleFilterClick = () => {
    if (filterButtonRef.current && onOpenFilter) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      onOpenFilter({
        top: rect.top,
        resetActive: () => setDetailFilterActive(false),
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full">
      <div className="relative h-full flex flex-col">
        {/* 헤더 (생략 - 기존과 동일) */}
        <div
          ref={headerRef}
          className="sticky top-0 z-10 bg-white py-4 px-6 border-b border-gray-stroke02"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">검색 결과</h3>

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setShowOpenOnly((prev) => !prev)}
                className={`flex items-center gap-1 px-[10px] py-[6px] rounded-full font-medium text-sm transition-all border ${
                  showOpenOnly
                    ? 'bg-white-_100 border-[rgba(120,195,71,0.3)] text-[#78C347]'
                    : 'bg-gray-stroke03 border-transparent text-gray-stroke60 hover:bg-white-_100 hover:border-gray-stroke07 hover:text-gray-stroke70'
                }`}
              >
                <Clock className={`w-4 h-4 ${showOpenOnly ? 'text-[#78C347]' : ''}`} />
                <span>영업중</span>
              </button>

              {mode === 'child' ? (
                <button
                  onClick={() => setShowDeliveryOnly((prev) => !prev)}
                  className={`flex items-center gap-1 px-[10px] py-[6px] rounded-full font-medium text-sm transition-all border ${
                    showDeliveryOnly
                      ? 'bg-white-_100 border-[rgba(120,195,71,0.3)] text-[#78C347]'
                      : 'bg-gray-stroke03 border-transparent text-gray-stroke60 hover:bg-white-_100 hover:border-gray-stroke05 hover:text-gray-stroke70'
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 ${showDeliveryOnly ? 'text-[#78C347]' : ''}`} />
                  <span>배달가능</span>
                </button>
              ) : (
                <button
                  ref={filterButtonRef}
                  onClick={handleFilterClick}
                  className={`flex items-center gap-1 px-[10px] py-[6px] rounded-full font-medium text-sm transition-all border ${
                    detailFilterActive
                      ? 'bg-white-_100 border-[rgba(120,195,71,0.3)] text-[#78C347]'
                      : 'bg-gray-stroke03 border-transparent text-gray-stroke60 hover:bg-white-_100 hover:border-gray-stroke05 hover:text-gray-stroke70'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  <span>상세조건</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto overlay-scrollbar">
          {places.map((place) => (
            <PlaceItem
              // ⭐ [핵심] ref 연결 (PlaceItem이 forwardRef여야만 작동함)
              ref={(el) => (itemRefs.current[place.id] = el)}
              key={place.id}
              place={place}
              mode={mode}
              isSelected={selectedPlace && selectedPlace.id === place.id}
              onSelect={onSelectPlace}
            />
          ))}
          {/* ... */}
        </div>
      </div>
    </div>
  );
}
