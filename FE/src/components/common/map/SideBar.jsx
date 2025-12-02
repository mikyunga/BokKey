'use client';

import { useState, useEffect } from 'react';
import { IconLogo } from '../../../utils/icons'; // ✅ 로고 아이콘 가져오기 (경로 확인 필요)

import SearchBar from './SearchBar';
import LocationDropdowns from './LocationDropdowns';
import SearchFilter from './SearchFilter';
import PlaceList from './PlaceList';

export default function Sidebar({ mode }) {
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // 모드 변경 시 필터 초기화
  useEffect(() => {
    setSelectedFilters([]);
  }, [mode]);

  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  return (
    <div className="w-[380px] h-full bg-white shadow-custom-drop flex flex-col">
      {/* 헤더 영역 */}
      <div className="p-4 border-b border-gray-stroke05">
        {/* ✅ 수정됨: 로고와 지역 선택을 한 줄(flex)로 배치 */}
        <div className="flex items-center justify-between mb-4">
          {/* 1. 로고 이미지 */}
          <img
            src={IconLogo}
            alt="복키 로고"
            className="h-[24px] object-contain" // 높이는 디자인에 맞춰 조절 (예: h-6)
          />

          {/* 2. 지역 선택 드롭다운 */}
          {/* LocationDropdowns 내부의 mb-3 때문에 레이아웃이 어긋난다면 
              LocationDropdowns.js에서 mb-3을 제거하거나 여기서 스타일 조정이 필요할 수 있습니다. 
              일단은 배치 우선으로 둡니다. */}
          <LocationDropdowns
            sido={sido}
            setSido={setSido}
            sigungu={sigungu}
            setSigungu={setSigungu}
          />
        </div>

        {/* 검색창 */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* 필터 (아동 모드일 때만) */}
      {mode === 'child' && (
        <SearchFilter
          mode={mode}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
        />
      )}

      {/* 결과 리스트 */}
      <PlaceList mode={mode} selectedFilters={selectedFilters} searchQuery={searchQuery} />
    </div>
  );
}
