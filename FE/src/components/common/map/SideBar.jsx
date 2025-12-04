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
}) {
  const headerRef = useRef(null);
  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(headerRef.current?.offsetHeight || 0);
    }
  }, []);

  // ⭐ 위치 정보(pos)를 받아서 상위 컴포넌트(MapPage)로 전달
  const handleOpenFilter = (pos) => {
    if (onOpenFilter) {
      onOpenFilter(pos);
    }
  };

  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? [] : [filterId]));
  };

  return (
    <div
      ref={headerRef}
      className="w-[380px] h-full bg-[#ffffff] shadow-custom-drop flex flex-col z-30 flex-shrink-0"
    >
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
          <SearchFilter selectedFilters={selectedFilters} onFilterToggle={handleFilterToggle} />
        )}
      </div>

      {/* 결과 리스트 */}
      <PlaceList
        mode={mode}
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onSelectPlace={setSelectedPlace}
        showOpenOnly={showOpenOnly}
        setShowOpenOnly={setShowOpenOnly}
        showDeliveryOnly={showDeliveryOnly}
        setShowDeliveryOnly={setShowDeliveryOnly}
        onOpenFilter={handleOpenFilter} // ⭐ 수정된 핸들러 전달
        sido={sido}
        sigungu={sigungu}
        onOpenRegionSelect={onOpenRegionSelect}
      />
    </div>
  );
}
