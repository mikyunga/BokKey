'use client';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BRAND_SHADOW = 'shadow-[0_2px_5px_0_rgba(149,215,105,0.8)]';
const BLACK_SHADOW = 'shadow-[0_2px_5px_0_rgba(0,0,0,0.1)]';

export default function SideActionButtons({ onMyLocation }) {
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    navigate('/favorites');
  };

  return (
    <div className="flex items-center gap-2">
      {/* 1. 내 위치 버튼 */}
      <button
        onClick={onMyLocation}
        style={{ backgroundColor: '#FFFFFF' }}
        className={`
          flex items-center gap-1
          px-[12px] py-[8px]
          rounded-full text-[14px] whitespace-nowrap
          transition-all
          ${BLACK_SHADOW}
          outline outline-1 outline-[rgba(149,215,105,0)] text-gray-stroke30
          hover:${BRAND_SHADOW}
        `}
      >
        <MapPin className="w-4 h-4" />
        <span>내 위치</span>
      </button>

      {/* 2. 즐겨찾기 버튼 */}
      <button
        onClick={handleFavoriteClick}
        style={{ backgroundColor: '#FFFFFF' }}
        className={`
          flex items-center gap-1
          px-[12px] py-[8px]
          rounded-full text-[14px] whitespace-nowrap
          transition-all
          ${BLACK_SHADOW}
          outline outline-1 outline-[rgba(149,215,105,0)] text-gray-stroke30
          hover:${BRAND_SHADOW}
        `}
      >
        <Star className="w-4 h-4" />
        <span>즐겨찾기</span>
      </button>
    </div>
  );
}
