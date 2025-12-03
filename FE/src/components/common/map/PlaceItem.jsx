'use client';

import { MapPin, Phone } from 'lucide-react';
import { IconStarWhite, IconStarYellow } from '../../../utils/icons';
import { CHILD_FILTERS } from '../../../constants/filters';

export default function PlaceItem({ place, mode, isSelected, onSelect }) {
  const isChildMode = mode === 'child';

  const handleClick = () => {
    onSelect(place);
  };

  const categoryLabel =
    CHILD_FILTERS.find((filter) => filter.id === place.category || filter.id === place.type)
      ?.label || '';

  return (
    <div
      onClick={handleClick}
      style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      className={`
        bg-white pl-6 pr-[18px] py-4 
        cursor-pointer 
        flex flex-col gap-[6px]
        max-h-48
      `}
    >
      {/* 상단: 가게 이름 + 업종, 오른쪽 star */}
      <div className="flex items-center">
        <div className="flex items-center gap-[6px] flex-1">
          <h4 className="font-semibold text-[16px]">{place.name}</h4>
          <span className="text-[14px] opacity-30 font-medium">{categoryLabel}</span>
        </div>
        <button className="text-gray-stroke30 hover:text-star">
          <img src={IconStarWhite} className="" />
        </button>
      </div>

      {/* 주소, 전화번호 */}
      <div className="flex flex-col gap-[2px] text-[14px]">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="text-[14px] opacity-70">{place.address}</span>
        </div>

        {isChildMode ? (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {place.phone ? (
              <span className="text-[14px] opacity-70">{place.phone}</span>
            ) : (
              <span className="opacity-30">정보 없음</span>
            )}
          </div>
        ) : (
          <div className="text-gray-stroke50 pl-4">{place.schedule}</div>
        )}
      </div>

      {/* 영업 상태, 배달 가능 라벨 */}
      <div className="flex gap-3 text-xs font-medium flex-shrink-0 sticky bottom-0 bg-white">
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
            style={{ backgroundColor: 'rgba(255, 146, 56, 0.)' }}
          >
            배달 가능
          </span>
        )}
      </div>
    </div>
  );
}
