'use client';

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
}) {
  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? [] : [filterId]));
  };

  return (
    // 사이드바 너비는 이제 내용물에 맞춰 유동적입니다.
    <div className="w-[380px] h-full bg-[#ffffff] shadow-custom-drop flex flex-col z-30 flex-shrink-0">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-stroke05">
        {/* ✅ 수정: justify-between 적용하여 좌우 끝에 배치 */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo (좌측) */}
          <img src={IconLogo} alt="복키 로고" className="h-[24px] object-contain flex-shrink-0" />

          {/* Dropdowns Wrapper (우측) */}
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
      </div>

      {/* 필터 */}
      {mode === 'child' && (
        <SearchFilter
          mode={mode}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
        />
      )}

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
      />
    </div>
  );
}
