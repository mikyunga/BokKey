'use client';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { IconLocationBlack, IconStarYellow, IconLocationMain } from '../../../utils/icons';

export default function SideActionButtons({
  onMyLocation,
  isLoadingLocation,
  locationError,
  isLocationFocused,

  onToggleFavorites,
  isFavoritesOpen,
}) {
  const [isHoveringLocation, setIsHoveringLocation] = useState(false);
  const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 font-medium">
        {/* 내 위치 버튼 */}
        <button
          onClick={onMyLocation}
          disabled={isLoadingLocation}
          onMouseEnter={() => setIsHoveringLocation(true)}
          onMouseLeave={() => setIsHoveringLocation(false)}
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: `0 1px 5px 0 rgba(0,0,0,${isHoveringLocation ? '0.3' : '0.15'})`,
          }}
          className={`
            flex items-center gap-1
            pl-[11px] pr-[12px] py-[7px]
            rounded-full text-[14px] whitespace-nowrap
            transition-all duration-200
            border
            ${isLocationFocused ? 'border-[#95D769]' : 'border-transparent text-black'}
            ${isLoadingLocation ? 'cursor-wait' : 'cursor-pointer'}
          `}
        >
          {isLoadingLocation ? (
            <Loader className="w-4 h-4 animate-spin text-[#78C347]" />
          ) : (
            <img
              src={isLocationFocused ? IconLocationMain : IconLocationBlack}
              alt="내 위치"
              className="w-[18px] h-[18px]"
            />
          )}
          <span>내 위치</span>
        </button>

        {/* 즐겨찾기 버튼 */}
        <button
          onClick={onToggleFavorites}
          onMouseEnter={() => setIsHoveringFavorite(true)}
          onMouseLeave={() => setIsHoveringFavorite(false)}
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: `0 1px 5px 0 rgba(0,0,0,${isHoveringFavorite ? '0.3' : '0.15'})`,
          }}
          className={`
            flex items-center gap-[2px]
            pl-[11px] pr-[12px] py-[7px]
            rounded-full text-[14px] whitespace-nowrap
            transition-all duration-200
            border
            ${isFavoritesOpen ? 'border-[#FFE32B] ' : 'border-transparent text-black'}
          `}
        >
          <img src={IconStarYellow} className="h-[21px]" alt="즐겨찾기" />
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
