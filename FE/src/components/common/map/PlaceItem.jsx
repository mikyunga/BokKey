'use client';

import { MapPin, Phone, User } from 'lucide-react';
import { CHILD_FILTERS } from '../../../constants/filters';

import FavoriteButton from './FavoriteButton';

export default function PlaceItem({ place, mode, onSelect }) {
  const isChildMode = mode === 'child';

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSelect(place, rect.top);
  };

  const categoryLabel =
    CHILD_FILTERS.find((filter) => filter.id === place.category || filter.id === place.type)
      ?.label || '';

  return (
    <div
      onClick={(e) => handleClick(e)}
      style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      className={`
        bg-white 
        pl-6 pr-[18px] py-4 
        cursor-pointer 
        flex flex-col gap-[6px]
        max-h-48
        transition-colors duration-150
        hover:bg-black/[0.02]
      `}
    >
      {/* 상단: 가게 이름 + 업종, 오른쪽 star */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[6px] flex-1">
          <h4
            className="
              font-semibold text-[16px]
              truncate
              cursor-default
              inline-block
              max-w-[75%]
            "
            onClick={() => navigator.clipboard.writeText(place.name)}
          >
            {place.name}
          </h4>
          <span className="text-[14px] opacity-30 font-medium" style={{ flexShrink: 0 }}>
            {categoryLabel}
          </span>
        </div>
        <FavoriteButton place={place} mode={mode} />
      </div>

      {/* 주소, 전화번호 */}
      <div className="flex flex-col gap-[4px] text-[14px] font-normal">
        {/* 주소 */}
        <div className="flex gap-[4px] items-start">
          <MapPin size={14} className="flex-shrink-0 text-black/70 opacity-30 mt-[2px]" />
          <span className="text-[14px] font-normal opacity-70 leading-[1.35] break-words">
            {place.address}
          </span>
        </div>

        {/* 전화/대상 */}
        {isChildMode ? (
          <div className="flex gap-[4px] items-center">
            <Phone size={14} className="flex-shrink-0 text-black/70 opacity-30 p-[0.5px]" />
            {place.phone ? (
              <span className="text-[14px] font-normal opacity-70 truncate">{place.phone}</span>
            ) : (
              <span className="text-[14px] font-normal opacity-30">정보 없음</span>
            )}
          </div>
        ) : (
          <div className="flex gap-[6px] items-center">
            <User size={14} className="flex-shrink-0 text-black/70 opacity-30" />
            <span className="text-[14px] font-normal opacity-70 truncate">
              {Array.isArray(place.target_name) ? place.target_name.join(', ') : place.target_name}
            </span>
          </div>
        )}
      </div>

      {/* 영업 상태, 배달 가능 라벨 */}
      <div className="flex gap-3 text-xs font-medium">
        {place.isOpen ? (
          <span
            className="text-orange rounded px-[2px] py-[0px]"
            style={{ backgroundColor: 'rgba(255, 146, 56, 0.08)' }}
          >
            영업 중
          </span>
        ) : (
          <span
            className="text-gray-400 rounded px-[2px] py-[0px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          >
            영업 종료
          </span>
        )}

        {isChildMode && place.delivery && (
          <span
            className="text-orange rounded px-[2px] py-[0px]"
            style={{ backgroundColor: 'rgba(255, 146, 56, 0.08)' }}
          >
            배달 가능
          </span>
        )}
      </div>
    </div>
  );
}
