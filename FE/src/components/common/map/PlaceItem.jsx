'use client';

import { CHILD_FILTERS } from '../../../constants/filters';
import { IconLocationGrey, IconCall, IconPerson } from '../../../utils/icons';

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
      <div className="flex items-center">
        <div className="flex items-center gap-[6px] flex-1">
          <h4 className="font-semibold text-[16px]">{place.name}</h4>
          <span className="text-[14px] opacity-30 font-medium">{categoryLabel}</span>
        </div>
        <FavoriteButton place={place} mode={mode} />
      </div>

      {/* 주소, 전화번호 */}
      <div className="flex flex-col gap-[2px] text-[14px] font-normal">
        <div className="flex items-center gap-2">
          <img src={IconLocationGrey} />
          <span className="text-[14px] font-normal opacity-70">{place.address}</span>
        </div>

        {isChildMode ? (
          <div className="flex items-center gap-2">
            <img src={IconCall} />
            {place.phone ? (
              <span className="text-[14px] font-normal opacity-70">{place.phone}</span>
            ) : (
              <span className="text-[14px] font-normal opacity-30">정보 없음</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img src={IconPerson} />
            <span className="text-[14px] font-normal opacity-70">
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
