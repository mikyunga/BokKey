'use client';

import { useState, useMemo } from 'react';

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

  // ✅ 퀵 필터 상태 추가
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDeliveryOnly, setShowDeliveryOnly] = useState(false);

  // 필터링 로직 (상태가 변경될 때만 재계산)
  const filteredPlaces = useMemo(() => {
    const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

    return places.filter((place) => {
      // 1. 기존 필터 (검색어, 카테고리, 지역)
      if (searchQuery && !place.name.includes(searchQuery)) return false;

      if (mode === 'child' && selectedFilters.length > 0) {
        if (!selectedFilters.includes(place.category)) return false;
      }

      if (sido) {
        const targetRegionCodes = REGIONS.filter(
          (r) => r.province === sido && (!sigungu || r.district === sigungu)
        ).map((r) => r.region_code);

        if (!place.region_code || !targetRegionCodes.includes(Number(place.region_code))) {
          return false;
        }
      }

      // 2. ✅ 신규 퀵 필터 로직 (중복 선택 가능)
      // "영업중" 필터가 활성화되었고, 현재 장소가 영업 중이 아니라면 제외
      if (showOpenOnly && !place.isOpen) return false;

      // "배달가능" 필터가 활성화되었고, 모드가 'child'이며, 배달이 불가능하면 제외
      if (mode === 'child' && showDeliveryOnly && !place.delivery) return false;

      return true;
    });
  }, [mode, searchQuery, selectedFilters, sido, sigungu, showOpenOnly, showDeliveryOnly]); // ✅ 의존성 배열에 퀵 필터 상태 추가

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // 모드 변경 시 모든 필터 상태 초기화
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setSelectedPlace(null);
    // ✅ 퀵 필터 상태 초기화
    setShowOpenOnly(false);
    setShowDeliveryOnly(false);
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
          // ✅ 퀵 필터 상태 및 설정 함수 전달
          showOpenOnly={showOpenOnly}
          setShowOpenOnly={setShowOpenOnly}
          showDeliveryOnly={showDeliveryOnly}
          setShowDeliveryOnly={setShowDeliveryOnly}
        />

        <MapContainer mode={mode} places={filteredPlaces} selectedPlace={selectedPlace} />
      </div>
    </div>
  );
}
