'use client';

import { ChevronDown, ChevronUp, MapPin, Phone, Clock, Star, Route } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '../../../contexts/FavoriteContext';

export default function ChildDetailPanel({ place, isCollapsed, onToggleCollapse, onClose }) {
  const [showAddressDetail, setShowAddressDetail] = useState(false);
  const [showTimeDetail, setShowTimeDetail] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(place.id, 'child');

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
        rounded-[12px]
        shadow-[0_4px_14px_rgba(0,0,0,0.12)]
        relative
        z-50
      "
    >
      {/* 제목 + 카테고리 + 닫기 */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[6px] items-center">
          <h2 className="font-semibold text-[20px]">{place.name}</h2>
          <span className="text-[14px] text-black/40 font-medium opacity-30">
            {place.categoryText}
          </span>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="group p-0 rounded-full transition-all duration-150 flex items-center justify-center"
        >
          <div className="rounded-full p-[3px] transition-all duration-150 group-hover:bg-black/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-black/50 group-hover:text-black"
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
      {statusLabels.length > 0 && (
        <span
          className="px-[6px] py-[2px] mb-2 rounded-[4px] text-[13px] font-medium w-fit"
          style={{ backgroundColor: 'rgba(255,146,56,0.08)', color: '#FF9238' }}
        >
          {statusLabels.join(' · ')}
        </span>
      )}

      {/* 주소, 전화, 시간 섹션을 하나의 wrapper로 묶음 */}
      <div className="flex flex-col gap-[12px]">
        {/* 주소 */}
        <div>
          <div
            className="flex items-center gap-[4px] cursor-pointer w-fit leading-none"
            style={{ alignItems: 'center' }}
            onClick={() => setShowAddressDetail((v) => !v)}
          >
            <MapPin size={14} className="flex items-center text-black/70" />
            <span className="opacity-70 text-[14px] leading-none flex items-center">
              {place.address}
            </span>
            {showAddressDetail ? (
              <ChevronUp size={14} className="flex items-center opacity-70" />
            ) : (
              <ChevronDown size={14} className="flex items-center opacity-70" />
            )}
          </div>

          {showAddressDetail && (
            <div className="ml-5 flex flex-col gap-[12px]">
              <div className="flex items-center gap-[6px] mt-[8px]">
                <span
                  className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium"
                  style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                >
                  지번
                </span>
                <span className="text-[14px] opacity-40 leading-none">{place.lotAddress}</span>
              </div>
            </div>
          )}
        </div>

        {/* 전화 */}
        <div>
          <div className="flex items-center gap-[6px] leading-none">
            <Phone size={14} className="opacity-70 flex-shrink-0 leading-none" />
            {place.phone ? (
              <span className="opacity-70 text-[14px] leading-none flex items-center">
                {place.phone}
              </span>
            ) : (
              <span className="opacity-40 text-[14px] leading-none flex items-center">
                정보 없음
              </span>
            )}
          </div>
        </div>

        {/* 시간 */}
        <div>
          <div
            className="flex items-center gap-[4px] cursor-pointer w-fit leading-none"
            style={{ alignItems: 'center' }}
            onClick={() => setShowTimeDetail((v) => !v)}
          >
            <Clock size={14} className="flex items-center leading-none opacity-70" />
            <span className="opacity-70 leading-none flex items-center">{place.time}</span>
            {showTimeDetail ? (
              <ChevronUp size={14} className="flex items-center leading-none opacity-70" />
            ) : (
              <ChevronDown size={14} className="flex items-center leading-none opacity-70" />
            )}
          </div>

          {showTimeDetail && (
            <div className="ml-5 flex flex-col gap-[12px]">
              <div className="flex items-center gap-[6px] mt-[8px]">
                <span
                  className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium"
                  style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                >
                  공휴일
                </span>
                <span className="text-[14px] opacity-40 leading-none">{place.holidayTime}</span>
              </div>

              {place.breakTime && (
                <div className="flex items-center gap-[6px] mt-[8px]">
                  <span
                    className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium"
                    style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                  >
                    브레이크
                  </span>
                  <span className="text-[14px] opacity-40 leading-none">{place.breakTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-end gap-3 pt-2">
        {/* ⭐ 즐겨찾기 버튼 */}
        <button
          onClick={() => toggleFavorite(place, 'child')}
          className="
            flex items-center gap-[4px] mt-[8px]
            pl-2 pr-[14px] py-2 rounded-full
            font-medium text-[14px]
            transition-all duration-150
          "
          style={{
            backgroundColor: fav ? 'rgba(120,195,71,0.15)' : 'rgba(120,195,71,0.1)',
            color: '#78C347',
          }}
        >
          <Star size={16} fill={fav ? '#FFD233' : 'none'} color={fav ? '#FFD233' : '#78C347'} />
          즐겨찾기
        </button>

        {/* 🧭 길찾기 버튼 (카카오맵 링크) */}
        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.latitude},${place.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-[4px] mt-[8px]
            px-[14px] py-2 rounded-full font-medium text-[14px]
            bg-[#78C347]
            hover:bg-[#6bb03f]
            transition-all duration-150
          "
        >
          <Route size={16} color="white" />
          <span className="text-white" style={{ color: 'rgba(255,255,255,0.98)' }}>
            길찾기
          </span>
        </a>
      </div>
    </div>
  );
}
