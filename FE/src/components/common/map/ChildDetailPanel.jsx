'use client';

import { ChevronDown, ChevronUp, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ChildDetailPanel({ place, isCollapsed, onToggleCollapse, onClose }) {
  const [showAddressDetail, setShowAddressDetail] = useState(false);
  const [showTimeDetail, setShowTimeDetail] = useState(false);

  const statusLabels = [];
  if (place.isOpen) statusLabels.push('영업 중');
  if (place.delivery) statusLabels.push('배달 가능');
  if (place.holidayOpen) statusLabels.push('공휴일 영업');

  return (
    <div
      className="
        bg-[#FFFFFF]
        pl-6 pr-[18px] py-4
        cursor-default
        flex flex-col gap-[8px]
        text-[14px] leading-[1.35]
      "
    >
      {/* 접기/닫기 */}
      <div className="flex justify-between items-center">
        <button onClick={onToggleCollapse} className="p-1 hover:bg-black/5 rounded-full">
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full">
          ✕
        </button>
      </div>

      {/* 가게 이름과 카테고리 */}
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-[20px]">{place.name}</h2>
        <span className="text-[14px] text-gray-400">{place.categoryText}</span>
      </div>

      {/* 상태 라벨 */}
      <div className="flex gap-1 mb-2">
        {statusLabels.length > 0 && (
          <span
            className="px-[3px] py-[2px] rounded-[4px] text-[14px] font-semibold"
            style={{ backgroundColor: 'rgba(255,146,56,0.08)', color: '#FF9238' }}
          >
            {statusLabels.join(' · ')}
          </span>
        )}
      </div>

      {/* 주소 */}
      <div
        className="flex flex-col gap-[2px] cursor-pointer"
        onClick={() => setShowAddressDetail((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span className="opacity-70">{place.address}</span>
        </div>
        {showAddressDetail && (
          <span className="text-[12px] opacity-70 px-2 py-2 bg-black/[0.03] rounded ml-6">
            {place.lotAddress}
          </span>
        )}
      </div>

      {/* 전화 */}
      <div className="flex items-center gap-2">
        <Phone size={16} />
        {place.phone ? (
          <span className="opacity-70">{place.phone}</span>
        ) : (
          <span className="opacity-30">정보 없음</span>
        )}
      </div>

      {/* 시간 */}
      <div
        className="flex flex-col gap-[2px] cursor-pointer"
        onClick={() => setShowTimeDetail((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="opacity-70">{place.time}</span>
        </div>
        {showTimeDetail && (
          <div className="ml-6 space-y-1">
            <span className="text-[12px] opacity-70 px-2 py-2 bg-black/[0.03] rounded block">
              공휴일: {place.holidayTime}
            </span>
            {place.breakTime && (
              <span className="text-[12px] opacity-70 px-2 py-2 bg-black/[0.03] rounded block">
                브레이크타임: {place.breakTime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button className="px-4 py-2 bg-white border rounded-full hover:bg-gray-50">
          ⭐ 즐겨찾기
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
          🧭 길찾기
        </button>
      </div>
    </div>
  );
}
