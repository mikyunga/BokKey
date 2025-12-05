'use client';

import { ChevronDown, ChevronUp, MapPin, Phone, Clock, Star, Route } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useFavorites } from '../../../contexts/FavoriteContext';

function SmartTooltip({ text, children, targetRef }) {
  const [show, setShow] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (targetRef?.current) {
      const element = targetRef.current;
      setIsOverflow(element.scrollWidth > element.clientWidth);
    }
  }, [targetRef, text]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => isOverflow && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && isOverflow && (
        <div
          className="
            absolute top-full left-0 mt-1
            px-2 py-1 rounded-md
            bg-black text-white text-[12px]
            shadow-lg whitespace-normal z-50
            animate-fadeIn
          "
          style={{ maxWidth: '240px' }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export default function ChildDetailPanel({
  place,
  isCollapsed,
  onToggleCollapse,
  onClose,
  onCopySuccess,
}) {
  const [showAddressDetail, setShowAddressDetail] = useState(false);
  const [showTimeDetail, setShowTimeDetail] = useState(false);

  const panelRef = useRef(null);
  const nameRef = useRef(null);
  const addressRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const copyToClipboard = (text, e) => {
    if (e) {
      e.stopPropagation();
    }
    navigator.clipboard.writeText(text);
    if (onCopySuccess) {
      onCopySuccess();
    }
  };

  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(place?.id, 'child');

  const statusLabels = [];
  if (place?.isOpen) statusLabels.push('영업 중');
  if (place?.delivery) statusLabels.push('배달 가능');
  if (place?.holidayOpen) statusLabels.push('공휴일 영업');

  return (
    <>
      <style>
        {`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-2px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.15s ease-out;
      }
      .copy-link:hover {
        text-decoration: underline;
      }
      `}
      </style>

      <div
        ref={panelRef}
        className={`
          bg-[#FFFFFF]
          p-6
          cursor-default
          flex flex-col gap-[8px]
          text-[14px] leading-[1.35]
          rounded-[12px]
          shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          relative z-50
          transition-all duration-300 transform
          ${isCollapsed ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
        `}
      >
        {/* 제목 + 카테고리 */}
        <div className="flex items-center gap-[6px] w-full">
          <h2
            ref={nameRef}
            className="
              font-semibold text-[18px]
              truncate
              cursor-default
            "
            onClick={() => navigator.clipboard.writeText(place?.name || '')}
          >
            {place?.name}
          </h2>
          <span className="text-[14px] text-black/40 font-medium opacity-30 whitespace-nowrap flex-shrink-0">
            {place?.categoryText}
          </span>
        </div>

        {/* 상태 라벨 */}
        {statusLabels.length > 0 && (
          <span
            className="px-[4px] py-[1px] mb-2 rounded-[4px] text-[13px] font-medium w-fit"
            style={{ backgroundColor: 'rgba(255,146,56,0.08)', color: '#FF9238' }}
          >
            {statusLabels.join(' · ')}
          </span>
        )}

        {/* 주소, 전화, 시간 섹션을 하나의 wrapper로 묶음 */}
        <div className="flex flex-col gap-[10px]">
          {/* 주소 */}
          <div>
            <div
              className="flex gap-[6px] cursor-pointer w-full items-start"
              onClick={() => setShowAddressDetail((v) => !v)}
            >
              <MapPin size={16} className="flex-shrink-0 text-black/70 mt-[1px]" />

              <div className="min-w-0 flex-1">
                <div className="flex gap-0 items-start">
                  <span
                    className="opacity-70 text-[14px] leading-[1.35] break-words cursor-pointer copy-link"
                    onClick={(e) => copyToClipboard(place?.address || '', e)}
                  >
                    {place?.address}
                  </span>

                  {showAddressDetail ? (
                    <ChevronUp size={16} className="flex-shrink-0 opacity-70 ml-[2px] mt-[1px]" />
                  ) : (
                    <ChevronDown size={16} className="flex-shrink-0 opacity-70 ml-[2px] mt-[1px]" />
                  )}
                </div>
              </div>
            </div>

            {showAddressDetail && (
              <div className="ml-5 flex flex-col gap-[12px]">
                <div className="flex gap-[6px] mt-[8px] items-start">
                  <span
                    className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit"
                    style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                  >
                    지번
                  </span>

                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[14px] opacity-30 leading-[1.35] break-words cursor-pointer block copy-link"
                      onClick={() => copyToClipboard(place?.lotAddress || '')}
                    >
                      {place?.lotAddress}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 전화 */}
          <div>
            <div className="flex items-center gap-[6px] leading-none">
              <Phone size={16} className="opacity-70 flex-shrink-0 leading-none" />
              {place?.phone ? (
                <span
                  className="opacity-70 text-[14px] leading-none truncate cursor-pointer inline-block copy-link"
                  onClick={() => copyToClipboard(place?.phone || '')}
                >
                  {place?.phone}
                </span>
              ) : (
                <span className="opacity-30 text-[14px] leading-none flex items-center">
                  정보 없음
                </span>
              )}
            </div>
          </div>

          {/* 시간 */}
          <div>
            <div
              className="flex gap-[6px] cursor-pointer w-full items-center"
              onClick={() => setShowTimeDetail((v) => !v)}
            >
              <Clock size={16} className="flex-shrink-0 text-black/70 mt-[1px]" />

              <div className="min-w-0 flex-1">
                <div className="flex gap-0 items-center">
                  <span
                    className="opacity-70 leading-none truncate cursor-pointer copy-link"
                    onClick={() => copyToClipboard(place?.time || '')}
                  >
                    {place?.time}
                  </span>

                  {showTimeDetail ? (
                    <ChevronUp size={16} className="flex-shrink-0 opacity-70 ml-[2px] mt-[1px]" />
                  ) : (
                    <ChevronDown size={16} className="flex-shrink-0 opacity-70 ml-[2px] mt-[1px]" />
                  )}
                </div>
              </div>
            </div>

            {showTimeDetail && (
              <div className="ml-5 flex flex-col gap-[12px]">
                <div className="flex items-center gap-[6px] mt-[8px]">
                  <span
                    className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit"
                    style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                  >
                    공휴일
                  </span>

                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[14px] opacity-30 leading-none truncate cursor-pointer flex items-center w-full copy-link"
                      onClick={() => copyToClipboard(place?.holidayTime || '')}
                    >
                      {place?.holidayTime}
                    </span>
                  </div>
                </div>

                {place?.breakTime && (
                  <div className="flex items-center gap-[6px] mt-[8px]">
                    <span
                      className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit"
                      style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                    >
                      브레이크
                    </span>

                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[14px] opacity-30 leading-none truncate cursor-pointer flex items-center w-full copy-link"
                        style={{ color: 'rgba(0,0,0,0.4)' }}
                        onClick={() => copyToClipboard(place?.breakTime || '')}
                      >
                        {place?.breakTime}
                      </span>
                    </div>
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
              pl-3 pr-[14px] py-2 rounded-full
              font-medium text-[14px]
              transition-all duration-150
            "
            style={{
              backgroundColor: favorite ? 'rgba(120,195,71,0.15)' : 'rgba(120,195,71,0.1)',
              color: '#78C347',
            }}
          >
            <Star
              size={16}
              fill={favorite ? '#FFD233' : 'none'}
              color={favorite ? '#FFD233' : '#78C347'}
            />
            즐겨찾기
          </button>

          {/* 🧭 길찾기 버튼 (카카오맵 링크) */}
          <a
            href={`https://map.kakao.com/link/to/${encodeURIComponent(place?.name || '')},${place?.latitude},${place?.longitude}`}
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
    </>
  );
}
