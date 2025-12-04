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
        p-6
        cursor-default
        flex flex-col gap-[8px]
        text-[14px] leading-[1.35]
        rounded-[10px]
        shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        relative
        z-50
      "
    >
      {/* 제목 + 카테고리 + 닫기 */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[8px]">
          <h2 className="font-semibold text-[20px]">{place.name}</h2>
          <span className="text-[14px] text-black-_30 font-medium">{place.categoryText}</span>
        </div>
        <button onClick={onClose} className="group p-1 rounded-full transition-all duration-150">
          <div
            className="
              rounded-full
              p-1
              transition-all
              duration-150
              group-hover:bg-[rgba(0,0,0,0.02)]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 opacity group-hover:opacity-100"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </button>
      </div>

      {/* 상태 라벨 */}
      <div className="flex gap-[8px] mb-2">
        {statusLabels.length > 0 && (
          <span
            className="px-[3px] py-[1px] rounded-[4px] text-[13px] font-medium"
            style={{ backgroundColor: 'rgba(255,146,56,0.08)', color: '#FF9238' }}
          >
            {statusLabels.join(' · ')}
          </span>
        )}
      </div>

      {/* 주소 */}
      <div className="mb-1">
        <div className="flex flex-col gap-[8px]">
          <div
            className="flex items-center gap-[6px] leading-none cursor-pointer w-fit"
            onClick={() => setShowAddressDetail((v) => !v)}
          >
            <MapPin size={14} />
            <span className="opacity-70 leading-none">{place.address}</span>
            {showAddressDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          {showAddressDetail && (
            <div className="ml-5 flex items-center gap-[8px]">
              <span
                className="text-[12px] px-[3px] py-[1px] rounded-[3px] text-black-_30 font-medium"
                style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
              >
                지번
              </span>
              <span className="text-[14px] opacity-30 leading-none">{place.lotAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* 전화 */}
      <div className="mb-1">
        <div className="flex items-center gap-[6px] leading-none">
          <Phone size={14} />
          {place.phone ? (
            <span className="opacity-70 leading-none">{place.phone}</span>
          ) : (
            <span className="opacity-30 leading-none">정보 없음</span>
          )}
        </div>
      </div>

      {/* 시간 */}
      <div className="mb-1">
        <div className="flex flex-col gap-[8px]">
          <div
            className="flex items-center gap-[6px] leading-none cursor-pointer w-fit"
            onClick={() => setShowTimeDetail((v) => !v)}
          >
            <Clock size={14} />
            <span className="opacity-70 leading-none">{place.time}</span>
            {showTimeDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          {showTimeDetail && (
            <div className="ml-5 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[12px] px-[3px] py-[1px] rounded-[3px] text-black-_30 font-medium"
                  style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                >
                  공휴일
                </span>
                <span className="text-[14px] opacity-30 leading-none">{place.holidayTime}</span>
              </div>

              {place.breakTime && (
                <div className="flex items-center gap-2">
                  <span
                    className="text-[12px] px-[3px] py-[1px] rounded-[3px] text-black-_30 font-medium"
                    style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  >
                    브레이크
                  </span>
                  <span className="text-[14px] opacity-30 leading-none">{place.breakTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
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
