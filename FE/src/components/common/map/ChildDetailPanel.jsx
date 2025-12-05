'use client';

import { ChevronDown, ChevronUp, MapPin, Phone, Clock, Star, Route } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { motion, AnimatePresence } from 'framer-motion';

// ... SmartTooltip 컴포넌트는 그대로 유지 ...
function SmartTooltip({ text, children, targetRef, className = '' }) {
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
      className={`relative ${className}`}
      onMouseEnter={() => isOverflow && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && isOverflow && (
        <div
          className="
            absolute top-full left-0 mt-1
            px-2 py-1 rounded-md text-black-_80
            border border-black-_07
            bg-white-_100 text-white text-[12px]
            shadow-[0_1px_4px_rgb(0,0,0,0.1)] whitespace-normal z-50
            animate-fadeIn
          "
          style={{ maxWidth: '240px', width: 'max-content' }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export default function ChildDetailPanel({ place, isCollapsed, onClose, onCopySuccess }) {
  // ... (나머지 state 및 로직 동일) ...
  const [showAddressDetail, setShowAddressDetail] = useState(false);
  const [showTimeDetail, setShowTimeDetail] = useState(false);
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const panelRef = useRef(null);
  const nameRef = useRef(null);

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

  const isValidInfo = (text) => {
    return text && text !== '정보 없음' && text.trim() !== '';
  };

  const copyToClipboard = (text, e) => {
    if (e) e.stopPropagation();
    if (!isValidInfo(text)) return;

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

  const dropdownVariants = {
    hidden: { height: 0, opacity: 0, marginTop: 0, overflow: 'hidden' },
    visible: {
      height: 'auto',
      opacity: 1,
      marginTop: 8,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

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
          transform transition-all
          ${
            !animReady
              ? 'opacity-0 -translate-x-2 scale-[0.995]'
              : isCollapsed
                ? 'opacity-0 -translate-x-4 scale-[0.97] duration-220 ease-in'
                : 'opacity-100 translate-x-0 scale-100 duration-300 ease-out'
          }  
        `}
      >
        {/* ⭐ 제목 + 카테고리 섹션 */}
        <div className="flex items-center gap-[6px] w-full">
          {/* SmartTooltip으로 감싸기 */}
          <SmartTooltip
            text={place?.name}
            targetRef={nameRef}
            // ❗ 수정됨: bg-white-_100 -> bg-white (또는 bg-[#FFFFFF])
            className="min-w-0 shrink flex-1"
          >
            <h2
              ref={nameRef}
              className="
                font-semibold text-[18px]
                truncate
                block w-full
                cursor-pointer
              "
              onClick={(e) => copyToClipboard(place?.name, e)}
            >
              {place?.name}
            </h2>
          </SmartTooltip>

          <span className="text-[14px] text-black/40 font-medium opacity-30 whitespace-nowrap flex-shrink-0">
            {place?.categoryText}
          </span>
        </div>

        {/* ... (나머지 코드 동일) ... */}
        {/* 상태 라벨 */}
        {statusLabels.length > 0 && (
          <span
            className="px-[6px] py-[3px] mb-2 rounded-[4px] text-[13px] font-medium w-fit"
            style={{ backgroundColor: 'rgba(255,146,56,0.08)', color: '#FF9238' }}
          >
            {statusLabels.join(' · ')}
          </span>
        )}

        {/* 주소, 전화, 시간 섹션 */}
        <div className="flex flex-col gap-[10px]">
          {/* 주소 */}
          <div>
            <div
              className="flex gap-[6px] cursor-pointer w-full items-start"
              onClick={() => setShowAddressDetail((v) => !v)}
            >
              <MapPin size={14} className="flex-shrink-0 text-black/70 mt-[2px] opacity-30" />

              <div className="min-w-0 flex-1">
                <div className="flex gap-0 items-start">
                  <span
                    className={
                      `opacity-70 text-[14px] leading-[1.35] break-words ` +
                      `${
                        isValidInfo(place?.address) ? 'cursor-pointer copy-link' : 'cursor-default'
                      }`
                    }
                    onClick={(e) => copyToClipboard(place?.address, e)}
                  >
                    {place?.address || '정보 없음'}
                  </span>

                  {showAddressDetail ? (
                    <ChevronUp size={16} className="flex-shrink-0 opacity-70 ml-[4px] mt-[1px]" />
                  ) : (
                    <ChevronDown size={16} className="flex-shrink-0 opacity-70 ml-[4px] mt-[1px]" />
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showAddressDetail && (
                <motion.div
                  className="ml-5 flex flex-col gap-[12px]"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex gap-[6px] items-start">
                    <span
                      className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit"
                      style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                    >
                      지번
                    </span>

                    <div className="flex-1 min-w-0">
                      <span
                        className={
                          `text-[14px] opacity-30 leading-[1.35] break-words block ` +
                          `${
                            isValidInfo(place?.lotAddress)
                              ? 'cursor-pointer copy-link'
                              : 'cursor-default'
                          }`
                        }
                        onClick={(e) => copyToClipboard(place?.lotAddress, e)}
                      >
                        {place?.lotAddress || '정보 없음'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 전화 */}
          <div>
            <div className="flex items-center gap-[6px] leading-none">
              <Phone size={14} className="opacity-30 flex-shrink-0 leading-none " />
              <span
                className={
                  `text-[14px] leading-none truncate inline-block ` +
                  `${
                    isValidInfo(place?.phone)
                      ? 'opacity-70 cursor-pointer copy-link'
                      : 'opacity-30 cursor-default'
                  }`
                }
                onClick={(e) => copyToClipboard(place?.phone, e)}
              >
                {place?.phone || '정보 없음'}
              </span>
            </div>
          </div>

          {/* 시간 */}
          <div>
            <div
              className="flex gap-[6px] cursor-pointer w-full items-center"
              onClick={() => setShowTimeDetail((v) => !v)}
            >
              <Clock size={14} className="flex-shrink-0 text-black/70 opacity-30" />

              <div className="min-w-0 flex-1">
                <div className="flex gap-0 items-center">
                  <span
                    className={
                      `opacity-70 leading-none truncate ` +
                      `${isValidInfo(place?.time) ? 'cursor-pointer copy-link' : 'cursor-default'}`
                    }
                    onClick={(e) => copyToClipboard(place?.time, e)}
                  >
                    {place?.time || '정보 없음'}
                  </span>

                  {showTimeDetail ? (
                    <ChevronUp size={16} className="flex-shrink-0 opacity-70 ml-[4px]" />
                  ) : (
                    <ChevronDown size={16} className="flex-shrink-0 opacity-70 ml-[4px]" />
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showTimeDetail && (
                <motion.div
                  className="ml-5 flex flex-col gap-[12px]"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex items-center gap-[6px]">
                    <span
                      className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit"
                      style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                    >
                      공휴일
                    </span>

                    <div className="flex-1 min-w-0">
                      <span
                        className={
                          `text-[14px] opacity-30 leading-none truncate flex items-center w-full ` +
                          `${
                            isValidInfo(place?.holidayTime)
                              ? 'cursor-pointer copy-link'
                              : 'cursor-default'
                          }`
                        }
                        onClick={(e) => copyToClipboard(place?.holidayTime, e)}
                      >
                        {place?.holidayTime || '정보 없음'}
                      </span>
                    </div>
                  </div>

                  {place?.breakTime && (
                    <div className="flex items-center gap-[6px]">
                      <span
                        className="text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit"
                        style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                      >
                        브레이크
                      </span>

                      <div className="flex-1 min-w-0">
                        <span
                          className={
                            `text-[14px] opacity-30 leading-none truncate flex items-center w-full ` +
                            `${
                              isValidInfo(place?.breakTime)
                                ? 'cursor-pointer copy-link'
                                : 'cursor-default'
                            }`
                          }
                          style={{ color: 'rgba(0,0,0,0.4)' }}
                          onClick={(e) => copyToClipboard(place?.breakTime, e)}
                        >
                          {place?.breakTime || '정보 없음'}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* 🧭 길찾기 버튼 */}
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
