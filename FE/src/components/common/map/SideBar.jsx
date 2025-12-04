'use client';

import { useState } from 'react';
import { useRef, useEffect } from 'react';
import { IconLogo } from '../../../utils/icons';
import SearchBar from './SearchBar';
import LocationDropdowns from './LocationDropdowns';
import SearchFilter from './SearchFilter';
import PlaceList from './PlaceList';

export default function Sidebar({
  mode,
  sido,
  setSido,
  sigungu,
  setSigungu,
  searchQuery,
  setSearchQuery,
  selectedFilters,
  setSelectedFilters,
  filteredPlaces,
  selectedPlace,
  setSelectedPlace,

  showOpenOnly,
  setShowOpenOnly,
  showDeliveryOnly,
  setShowDeliveryOnly,

  onOpenFilter,
  onOpenRegionSelect,
  onHeaderHeightChange,

  /** ⭐⭐ 이 두 개를 반드시 받아야 함 */
  detailFilterActive,
  setDetailFilterActive,
}) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(headerRef.current?.offsetHeight || 0);
    }
  }, []);

  // 필터 위치 계산
  const handleOpenFilter = (pos) => {
    if (onOpenFilter) onOpenFilter(pos);
  };

  return (
    <div className="w-[380px] h-full bg-[#ffffff] shadow-custom-drop flex flex-col z-30 flex-shrink-0">
      {/* 헤더 */}
      <div ref={headerRef} className="px-6 pt-6 pb-4 p-4 border-b border-gray-stroke05">
        <div className="flex items-center justify-between mb-4">
          <img src={IconLogo} alt="복키 로고" className="h-[24px] object-contain flex-shrink-0" />

          <div className="flex-shrink-0">
            <LocationDropdowns
              sido={sido}
              setSido={setSido}
              sigungu={sigungu}
              setSigungu={setSigungu}
            />
          </div>
        </div>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {mode === 'child' && (
          <SearchFilter
            selectedFilters={selectedFilters}
            onFilterToggle={(id) => {
              setSelectedFilters((prev) => (prev.includes(id) ? [] : [id]));
            }}
          />
        )}
      </div>

      {/* ⭐ PlaceList에 detailFilterActive 전달해야 함 */}
      <PlaceList
        mode={mode}
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onSelectPlace={setSelectedPlace}
        showOpenOnly={showOpenOnly}
        setShowOpenOnly={setShowOpenOnly}
        showDeliveryOnly={showDeliveryOnly}
        setShowDeliveryOnly={setShowDeliveryOnly}
        onOpenFilter={handleOpenFilter}
        sido={sido}
        sigungu={sigungu}
        onOpenRegionSelect={onOpenRegionSelect}
        /** ⭐⭐ 핵심: 이걸 전달해야 버튼 활성화 로직이 작동함 */
        detailFilterActive={detailFilterActive}
        setDetailFilterActive={setDetailFilterActive}
      />
    </div>
  );
}
