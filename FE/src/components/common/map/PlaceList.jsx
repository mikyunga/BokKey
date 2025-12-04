'use client';

import { useRef, useEffect } from 'react';
import { Clock, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import PlaceItem from './PlaceItem';

export default function PlaceList({
  mode,
  places,
  selectedPlace,
  onSelectPlace,
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

  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(headerRef.current?.offsetHeight || 0);
    }
  }, []);

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
        {/* ìƒë‹¨ í—¤ë" */}
        <div
          ref={headerRef}
          className="sticky top-0 z-10 bg-white py-4 px-6 border-b border-gray-stroke02"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">검색 결과</h3>

            <div className="flex items-center gap-2 text-sm">
              {/* 영업중 */}
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

              {/* 배달 가능 */}
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

        {/* ë¦¬ìŠ¤íŠ¸ */}
        <div className="flex-1 overflow-y-auto overlay-scrollbar">
          {places.map((place) => (
            <PlaceItem
              key={place.id}
              place={place}
              mode={mode}
              isSelected={selectedPlace && selectedPlace.id === place.id}
              onSelect={(place, top) => onSelectPlace(place, top)}
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
