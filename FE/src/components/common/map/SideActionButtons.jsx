'use client';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconLocationBlack, IconStarYellow, IconLocationMain } from '../../../utils/icons';

const BLACK_SHADOW = 'shadow-[0_1px_5px_0_rgba(0,0,0,0.15)]';
const DARKER_BLACK_SHADOW = 'shadow-[0_1px_5px_0_rgba(0,0,0,0.3)]';

export default function SideActionButtons({
  onMyLocation,
  isLoadingLocation,
  locationError,
  isLocationFocused,
}) {
  const navigate = useNavigate();
  const [isHoveringLocation, setIsHoveringLocation] = useState(false);
  const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);

  const handleFavoriteClick = () => {
    navigate('/favorites');
  };

  return (
    <>
      <div className="flex items-center gap-2 font-medium">
        {/* 1. 내 위치 버튼 */}
        <button
          onClick={onMyLocation}
          disabled={isLoadingLocation}
          onMouseEnter={() => setIsHoveringLocation(true)}
          onMouseLeave={() => setIsHoveringLocation(false)}
          style={{
            backgroundColor: isLocationFocused ? '#FFFFFF' : '#FFFFFF',
            boxShadow: isLocationFocused
              ? `inset 0 2px 4px rgba(0,0,0,0), 0 1px 5px rgba(0,0,0,0.2)`
              : `0 1px 5px 0 rgba(0,0,0,${isLocationFocused ? (isHoveringLocation ? '0.5' : '0.4') : isHoveringLocation ? '0.3' : '0.15'})`,
          }}
          className={`
            flex items-center gap-1
            pl-[11px] pr-[12px] py-[8px]
            rounded-full text-[14px] whitespace-nowrap
            transition-all
            outline outline-1 ${isLocationFocused ? 'outline-[rgba(0,0,0,0)]' : 'outline-[rgba(149,215,105,0)]'}
            ${isLoadingLocation ? 'cursor-wait' : 'cursor-pointer'}
          `}
        >
          {isLoadingLocation ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <img
              src={isLocationFocused ? IconLocationMain : IconLocationBlack}
              className={` ${!isLocationFocused ? 'opacity-100' : ''}`}
            />
          )}
          <span className={`${!isLocationFocused ? 'opacity-100' : ''}`}>내 위치</span>
        </button>

        {/* 2. 즐겨찾기 버튼 */}
        <button
          onClick={handleFavoriteClick}
          onMouseEnter={() => setIsHoveringFavorite(true)}
          onMouseLeave={() => setIsHoveringFavorite(false)}
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: `0 1px 5px 0 rgba(0,0,0,${isHoveringFavorite ? '0.3' : '0.15'})`,
          }}
          className={`
            flex items-center gap-[2px]
            pl-[11px] pr-[12px] py-[8px]
            rounded-full text-[14px] whitespace-nowrap
            transition-all
            outline outline-1 outline-[rgba(149,215,105,0)]
          `}
        >
          <img src={IconStarYellow} className="h-[21px]" />
          <span>즐겨찾기</span>
        </button>
      </div>

      {locationError && (
        <div className="absolute top-20 left-0 bg-red-50 border-red-200 rounded-md p-3 text-red-700 text-xs whitespace-nowrap z-50">
          {locationError}
        </div>
      )}
    </>
  );
}
