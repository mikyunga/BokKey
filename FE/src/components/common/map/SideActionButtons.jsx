'use client';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ⭐ useLocation 추가
import { IconLocationBlack, IconStarYellow, IconLocationMain } from '../../../utils/icons';

export default function SideActionButtons({
  onMyLocation,
  isLoadingLocation,
  locationError,
  isLocationFocused,
}) {
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ 현재 경로 확인용

  const [isHoveringLocation, setIsHoveringLocation] = useState(false);
  const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);

  // ⭐ 현재 경로가 '/favorites' 인지 확인
  const isFavoritesActive = location.pathname === '/favorites';

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
            backgroundColor: '#FFFFFF',
            boxShadow: `0 1px 5px 0 rgba(0,0,0,${isHoveringLocation ? '0.3' : '0.15'})`,
          }}
          className={`
            flex items-center gap-1
            pl-[11px] pr-[12px] py-[8px]
            rounded-full text-[14px] whitespace-nowrap
            transition-all duration-200
            border
            ${
              isLocationFocused
                ? 'border-[#78C347] text-[#78C347]' // 활성: 초록
                : 'border-transparent text-black' // 비활성: 검정
            }
            ${isLoadingLocation ? 'cursor-wait' : 'cursor-pointer'}
          `}
        >
          {isLoadingLocation ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <img
              src={isLocationFocused ? IconLocationMain : IconLocationBlack}
              alt="내 위치"
              className="w-[18px] h-[18px]"
            />
          )}
          <span>내 위치</span>
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
            transition-all duration-200
            border
            ${
              /* ⭐ [핵심 수정] 즐겨찾기 활성화 시 노란색 테두리와 글자색 적용 */
              isFavoritesActive
                ? 'border-[#FFE32B]' // 활성: 노랑(#FFE32B) 테두리 + 글씨
                : 'border-transparent text-black' // 비활성: 투명 테두리 + 검정 글씨
            }
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
