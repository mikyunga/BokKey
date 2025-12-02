'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import LocationDropdowns from './LocationDropdowns';
import SearchFilter from './SearchFilter';
import PlaceList from './PlaceList';

export default function Sidebar({ mode }) {
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // 모드가 변경되면 선택된 필터 초기화 (아동 <-> 노인 전환 시 꼬임 방지)
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
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-stroke05">
        <div className="text-main text-2xl font-bold mb-4">복키🍴</div>

        {/* 지역 선택 */}
        <LocationDropdowns
          sido={sido}
          setSido={setSido}
          sigungu={sigungu}
          setSigungu={setSigungu}
        />

        {/* 검색창 */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* ✅ 수정됨: 아동 급식카드 모드일 때만 카테고리 필터(SearchFilter) 표시 
        노인 무료급식소는 카테고리 필터가 없음
      */}
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
