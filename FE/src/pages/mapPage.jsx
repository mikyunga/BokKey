'use client';

import { useState } from 'react';

import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';

export default function MapPage() {
  const [mode, setMode] = useState('child'); // 'child' or 'senior'

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 카테고리 토글 */}
      <CategoryToggle mode={mode} onModeChange={setMode} />

      {/* 사이드바 + 지도 */}
      <div className="flex w-full h-full">
        <Sidebar mode={mode} />
        <MapContainer mode={mode} />
      </div>
    </div>
  );
}
