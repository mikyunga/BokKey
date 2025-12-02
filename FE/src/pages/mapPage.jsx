'use client';

import { useState, useMemo } from 'react';

// 컴포넌트 import
import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';

// 데이터 import (경로는 프로젝트 구조에 맞춰 조정 필요)
import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';

export default function MapPage() {
  const [mode, setMode] = useState('child'); // 'child' or 'senior'

  // Sidebar에 있던 상태들을 여기로 이사시킴 (State Lifting)
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // ✅ 필터링 로직을 여기서 수행 (MapContainer와 Sidebar가 같은 데이터를 보게 하기 위함)
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

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* 카테고리 토글 */}
      <CategoryToggle
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          // 모드 변경 시 필터 초기화
          setSelectedFilters([]);
          setSido('');
          setSigungu('');
          setSearchQuery('');
        }}
      />

      <div className="flex w-full h-full relative">
        {/* Sidebar에 상태와 결과 데이터 전달 */}
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
          filteredPlaces={filteredPlaces} // 필터링된 결과 전달
        />

        {/* ✅ MapContainer에도 필터링된 결과(places) 전달 */}
        <MapContainer mode={mode} places={filteredPlaces} />
      </div>
    </div>
  );
}
