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
  filteredPlaces, // 부모로부터 받은 데이터
}) {
  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  return (
    <div className="w-[380px] h-full bg-white shadow-custom-drop flex flex-col z-10">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-stroke05">
        <div className="flex items-center justify-between mb-4">
          <img src={IconLogo} alt="복키 로고" className="h-[24px] object-contain" />
          <LocationDropdowns
            sido={sido}
            setSido={setSido}
            sigungu={sigungu}
            setSigungu={setSigungu}
          />
        </div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {mode === 'child' && (
        <SearchFilter
          mode={mode}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
        />
      )}

      {/* 필터링 로직 없이 결과 데이터만 넘겨줌 */}
      <PlaceList mode={mode} places={filteredPlaces} />
    </div>
  );
}
