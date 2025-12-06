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

  // 1. 리스트 컨테이너(스크롤 되는 영역)를 잡기 위한 ref
  const listRef = useRef(null);

  // 2. 각 아이템의 위치를 저장할 ref
  const itemRefs = useRef({});

  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(headerRef.current?.offsetHeight || 0);
    }
  }, []);

  // ⭐ [핵심 수정] 선택된 아이템을 "약간 위쪽"으로 스크롤
  useEffect(() => {
    if (selectedPlace && itemRefs.current[selectedPlace.id] && listRef.current) {
      const item = itemRefs.current[selectedPlace.id];
      const list = listRef.current;

      // 아이템의 현재 위치와 높이 계산
      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;
      const listHeight = list.offsetHeight;

      // 💡 계산 로직: 아이템의 중간이 리스트 높이의 35% 지점(약간 위)에 오도록 설정
      // (보통 중앙은 0.5인데, 0.35 정도로 잡으면 시야상 보기 좋은 상단부에 위치합니다)
      const targetScrollTop = itemTop - listHeight * 0.2 + itemHeight / 2;

      list.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
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

  // PlaceItem에서 선택 시 실행되는 함수
  const handlePlaceSelect = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place);
    } else {
      console.error('❌ PlaceList의 onSelectPlace가 undefined입니다!');
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full">
      <div className="relative h-full flex flex-col">
        {/* 상단 헤더 */}
        <div
          ref={headerRef}
          className="sticky top-0 z-10 bg-white py-4 px-6 border-b border-gray-stroke02"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">검색 결과</h3>

            <div className="flex items-center gap-2 text-sm">
              {/* 영업중 필터 */}
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

              {/* 배달 가능 필터 (아동 모드) / 상세 조건 필터 (노인 모드) */}
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

        {/* 리스트 영역 (여기에 ref 연결!) */}
        <div
          ref={listRef} // ⭐ 스크롤 제어를 위해 ref 연결
          className="flex-1 overflow-y-auto overlay-scrollbar relative" // relative 추가 (offsetTop 계산 정확도 위해)
        >
          {places.map((place) => (
            <PlaceItem
              // ⭐ 각 아이템의 ref 저장
              ref={(el) => (itemRefs.current[place.id] = el)}
              key={place.id}
              place={place}
              mode={mode}
              isSelected={selectedPlace && selectedPlace.id === place.id}
              onSelect={handlePlaceSelect}
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
