'use client';

// ⭐ 1. forwardRef 불러오기
import { forwardRef } from 'react';
import { MapPin, Phone, User } from 'lucide-react';
import { CHILD_FILTERS } from '../../../constants/filters';
import FavoriteButton from './FavoriteButton';

// ⭐ 2. 컴포넌트를 forwardRef로 감싸고, 두 번째 인자로 ref 받기
const PlaceItem = forwardRef(({ place, mode, onSelect, isSelected }, ref) => {
  const isChildMode = mode === 'child';

  const handleClick = () => {
    console.log('🔵 PlaceItem 클릭됨:', place.name);
    if (onSelect) {
      onSelect(place);
    } else {
      console.warn('⚠️ onSelect가 없습니다!');
    }
  };

  const categoryLabel =
    CHILD_FILTERS.find((filter) => filter.id === place.category || filter.id === place.type)
      ?.label || '';

  return (
    <div
      ref={ref} // ⭐ 3. 여기에 ref 연결! (이게 있어야 스크롤이 됩니다)
      onClick={handleClick}
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: isSelected && 'rgba(0, 0, 0, 0.02)',
      }}
      className={`
        pl-6 pr-[18px] py-4 
        cursor-pointer 
        flex flex-col gap-[6px]
        max-h-48
        transition-colors duration-100
        hover:bg-black-_01
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
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(place.name);
            }}
          >
            {place.name}
          </h4>
          <span className="text-[14px] opacity-30 font-medium" style={{ flexShrink: 0 }}>
            {categoryLabel}
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton place={place} mode={mode} />
        </div>
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
});

// ⭐ 4. 디버깅용 이름 설정
PlaceItem.displayName = 'PlaceItem';

export default PlaceItem;
