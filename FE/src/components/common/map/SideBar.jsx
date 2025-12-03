'use client';

import { useState } from 'react';
import { IconLogo } from '../../../utils/icons';
import SearchBar from './SearchBar';
import LocationDropdowns from './LocationDropdowns';
import SearchFilter from './SearchFilter';
import PlaceList from './PlaceList';
import FilterPanel from './FilterPanel';

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
  onOpenRegionSelect, // ⭐ 지역 선택 버튼 클릭 핸들러 추가
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? [] : [filterId]));
  };

  const handleOpenFilter = () => {
    if (onOpenFilter) {
      onOpenFilter();
    } else {
      setIsFilterOpen(prev => !prev);
    }
  };

  return (
    <div className="w-[380px] h-full bg-[#ffffff] shadow-custom-drop flex flex-col z-30 flex-shrink-0">
      {/* 헤더 */}
      <div className="px-6 pt-6 pb-4 p-4 border-b border-gray-stroke05">
        <div className="flex items-center justify-between mb-4">
          <img src={IconLogo} alt="복키 로고" className="h-[24px] object-contain flex-shrink-0" />

          {/* 기존 시도/시군구 UI도 유지 (검색창 자동 필터용) */}
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

        {/* 아동 모드에서만 음식 카테고리 필터 */}
        {mode === 'child' && (
          <SearchFilter
            mode={mode}
            selectedFilters={selectedFilters}
            onFilterToggle={handleFilterToggle}
          />
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
        onOpenFilter={handleOpenFilter} // 상세조건
        sido={sido} // ⭐ 지역 상태 전달
        sigungu={sigungu} // ⭐ 지역 상태 전달
        onOpenRegionSelect={onOpenRegionSelect} // ⭐ 지역 선택 버튼 눌렀을 때 실행
      />

      {isFilterOpen && (
        <FilterPanel
          places={filteredPlaces}
          onFiltered={(newPlaces) => {
            setSelectedPlace(null);
            setIsFilterOpen(false);
            // optionally update filteredPlaces if needed
          }}
          onCancel={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
