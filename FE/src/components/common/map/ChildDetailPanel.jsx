'use client';

import { ChevronDown, ChevronUp, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ChildDetailPanel({ place, isCollapsed, onToggleCollapse, onClose }) {
  const [showAddressDetail, setShowAddressDetail] = useState(false);
  const [showTimeDetail, setShowTimeDetail] = useState(false);

  return (
    <div className="h-full w-full bg-[#FFFFFF] shadow-xl border-l border-gray-200 transition-all duration-300 ease-in-out">
      {/* 접기 버튼 */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-4 left-3 p-1 hover:bg-black/5 rounded-full"
      >
        {isCollapsed ? <ChevronDown /> : <ChevronUp />}
      </button>

      {/* 닫기 버튼 */}
      {!isCollapsed && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full"
        >
          ✕
        </button>
      )}

      {/* 내용 */}
      {!isCollapsed && place && (
        <div className="p-6 overflow-y-auto h-fit">
          {/* 제목 */}
          <h2 className="text-xl font-semibold mb-1">{place.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{place.categoryText}</p>

          {/* 상태 라벨 */}
          <div className="flex gap-2 text-xs font-medium mb-4">
            {place.isOpen && (
              <span className="px-2 py-1 rounded bg-orange-100 text-orange-600">영업 중</span>
            )}
            {place.delivery && (
              <span className="px-2 py-1 rounded bg-orange-100 text-orange-600">배달 가능</span>
            )}
            {place.holidayOpen && (
              <span className="px-2 py-1 rounded bg-orange-100 text-orange-600">공휴일 영업</span>
            )}
          </div>

          {/* 주소 */}
          <div
            className="p-3 rounded-lg border bg-white hover:bg-black/5 cursor-pointer mb-3"
            onClick={() => setShowAddressDetail((v) => !v)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{place.address}</span>
              </div>
              {showAddressDetail ? <ChevronUp /> : <ChevronDown />}
            </div>

            {showAddressDetail && (
              <div className="text-sm text-gray-600 ml-6 mt-2">{place.lotAddress}</div>
            )}
          </div>

          {/* 전화번호 */}
          <div className="flex gap-2 items-center text-sm text-gray-600 mb-3">
            <Phone size={16} />
            {place.phone ? place.phone : <span className="opacity-40">정보 없음</span>}
          </div>

          {/* 시간 */}
          <div
            className="p-3 rounded-lg border bg-white hover:bg-black/5 cursor-pointer mb-3"
            onClick={() => setShowTimeDetail((v) => !v)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{place.time}</span>
              </div>
              {showTimeDetail ? <ChevronUp /> : <ChevronDown />}
            </div>

            {showTimeDetail && (
              <div className="text-sm ml-6 mt-2 space-y-1">
                <div>공휴일: {place.holidayTime}</div>
                {place.breakTime && <div>브레이크타임: {place.breakTime}</div>}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-white border rounded-full">⭐ 즐겨찾기</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-full">🧭 길찾기</button>
          </div>
        </div>
      )}
    </div>
  );
}
