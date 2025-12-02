'use client';

import { useState, useEffect } from 'react';
import { IconLogo } from '../../../utils/icons';

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
    setSido(''); // 모드 변경 시 지역 선택도 초기화 (필요 시 유지 가능)
    setSigungu('');
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

      {/* ✅ 수정됨: sido, sigungu를 PlaceList로 전달 */}
      <PlaceList
        mode={mode}
        selectedFilters={selectedFilters}
        searchQuery={searchQuery}
        sido={sido}
        sigungu={sigungu}
      />
    </div>
  );
}
