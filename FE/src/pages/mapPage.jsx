'use client';

import { useState, useMemo } from 'react';

// ⚠️ Import 경로는 고객님 프로젝트 구조에 맞게 조정하세요.
import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';

import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';

export default function MapPage() {
  const [mode, setMode] = useState('child');

  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const filteredPlaces = useMemo(() => {
    const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

    return places.filter((place) => {
      // 1. 검색어 필터
      if (searchQuery && !place.name.includes(searchQuery)) return false;

      // 2. 카테고리 필터 (아동일 때만)
      if (mode === 'child' && selectedFilters.length > 0) {
        if (!selectedFilters.includes(place.category)) return false;
      }

      // 3. 지역 필터
      if (sido) {
        const targetRegionCodes = REGIONS.filter(
          (r) => r.province === sido && (!sigungu || r.district === sigungu)
        ).map((r) => r.region_code);

        if (!place.region_code || !targetRegionCodes.includes(Number(place.region_code))) {
          return false;
        }
      }

      return true;
    });
  }, [mode, searchQuery, selectedFilters, sido, sigungu]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setSelectedPlace(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <CategoryToggle mode={mode} onModeChange={handleModeChange} />

      <div className="flex w-full h-full relative">
        <Sidebar
          mode={mode}
          sido={sido}
          setSido={setSido}
          sigungu={sigungu}
          setSigungu={setSigungu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filteredPlaces={filteredPlaces}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
        />

        <MapContainer mode={mode} places={filteredPlaces} selectedPlace={selectedPlace} />
      </div>
    </div>
  );
}
