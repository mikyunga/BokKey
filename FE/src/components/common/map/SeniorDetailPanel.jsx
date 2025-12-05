'use client';

import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  User,
  Clock,
  Star,
  CarFront,
  Calendar,
  Utensils,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useFavorites } from '../../../contexts/FavoriteContext';
// ⭐ Framer Motion 추가
import { motion, AnimatePresence } from 'framer-motion';

// ... SmartTooltip은 동일하게 유지 ...
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

export default function SeniorDetailPanel({ place, isCollapsed, onClose, onCopySuccess }) {
  const [animReady, setAnimReady] = useState(false);
  const [showAddressDetail, setShowAddressDetail] = useState(false);

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
  const favorite = isFavorite(place?.id, 'senior');

  // 상세정보 라벨 스타일 (지번, 급식장소 등 - 회색 유지)
  const labelClass =
    'text-[12px] px-[4px] py-[1px] rounded-[3px] text-black-_30 font-medium flex-shrink-0 h-fit items-center';
  const labelStyle = { backgroundColor: 'rgba(0,0,0,0.04)' };

  // ⭐ 섹션 라벨 스타일 (오렌지색 적용)
  const sectionLabelClass = 'px-[4px] py-[1px] mb-3 rounded-[4px] text-[13px] font-medium w-fit';
  const sectionLabelStyle = {
    backgroundColor: 'rgba(255,146,56,0.08)',
    color: '#FF9238',
  };

  // ⭐ 드롭다운 애니메이션 설정 (marginTop을 여기서 제어)
  const dropdownVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      overflow: 'hidden',
    },
    visible: {
      height: 'auto',
      opacity: 1,
      marginTop: 8, // ⭐ 여기가 열릴 때 여백을 담당합니다.
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
      height: 0,
      opacity: 0,
      marginTop: 0, // ⭐ 닫힐 때 여백도 자연스럽게 0으로 줄어듭니다.
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
        {/* 제목 */}
        <div className="flex items-start justify-between gap-2 w-full">
          <div className="flex-1 min-w-0">
            <h2
              ref={nameRef}
              className="
                font-semibold text-[18px]
                truncate
                cursor-default
                mb-3
              "
              onClick={(e) => copyToClipboard(place?.name, e)}
            >
              {place?.name}
            </h2>
          </div>
        </div>

        {/* -------------------- 📌 급식소 안내 -------------------- */}
        <div>
          {/* ⭐ 섹션 라벨: 오렌지색 적용 */}
          <div className={sectionLabelClass} style={sectionLabelStyle}>
            급식소 안내
          </div>

          {/* 주소 */}
          <div className="flex flex-col mb-[10px]">
            <div
              className="flex items-start gap-[6px] cursor-pointer"
              onClick={() => setShowAddressDetail((v) => !v)}
            >
              <MapPin size={14} className="opacity-30 flex-shrink-0 mt-[2px]" />

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-[4px]">
                  <span
                    className={`text-[14px] break-words ${
                      isValidInfo(place?.address)
                        ? 'opacity-70 cursor-pointer copy-link'
                        : 'opacity-30 cursor-default'
                    }`}
                    onClick={(e) => copyToClipboard(place?.address, e)}
                  >
                    {place?.address || '정보 없음'}
                  </span>

                  {showAddressDetail ? (
                    <ChevronUp size={16} className="opacity-70 mt-[2px]" />
                  ) : (
                    <ChevronDown size={16} className="opacity-70 mt-[2px]" />
                  )}
                </div>

                {/* ⭐ 주소 상세 애니메이션 적용 */}
                <AnimatePresence>
                  {showAddressDetail && (
                    <motion.div
                      // ❗ 중요 수정: 여기서 'mt-[8px]' 클래스를 제거했습니다.
                      // variants의 marginTop 제어와 충돌을 방지하여 부드럽게 닫히게 합니다.
                      className="pl-[2px] flex items-start gap-[6px]"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <span className={labelClass} style={labelStyle}>
                        지번
                      </span>

                      <span
                        className={`text-[14px] break-words opacity-30 ${
                          isValidInfo(place?.lotAddress)
                            ? 'cursor-pointer copy-link'
                            : 'cursor-default'
                        }`}
                        onClick={(e) => copyToClipboard(place?.lotAddress, e)}
                      >
                        {place?.lotAddress || '정보 없음'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 급식 장소 */}
          <div className="flex items-center gap-[6px] mb-[10px]">
            <Utensils size={14} className="opacity-30 flex-shrink-0" />
            <div className="flex items-center gap-[6px]">
              <span className={labelClass} style={labelStyle}>
                급식 장소
              </span>
              <span
                className={`text-[14px] leading-[1.35] break-words pt-[1px] ${
                  isValidInfo(place?.place) ? 'opacity-70' : 'opacity-30'
                }`}
              >
                {place?.place || '정보 없음'}
              </span>
            </div>
          </div>

          {/* 전화번호 */}
          <div className="flex items-start gap-[6px] mb-[10px]">
            <Phone size={14} className="opacity-30 flex-shrink-0 mt-[2px]" />
            <span
              className={`text-[14px] leading-[1.35] break-words ${
                isValidInfo(place?.phone)
                  ? 'opacity-70 cursor-pointer copy-link'
                  : 'opacity-30 cursor-default'
              }`}
              onClick={(e) => copyToClipboard(place?.phone, e)}
            >
              {place?.phone || '정보 없음'}
            </span>
          </div>

          <div className="border-b opacity-50 my-4"></div>

          {/* -------------------- 📌 이용 조건 -------------------- */}
          {/* ⭐ 섹션 라벨: 오렌지색 적용 */}
          <div className={sectionLabelClass} style={sectionLabelStyle}>
            이용 조건
          </div>

          {/* 대상 */}
          <div className="flex items-start gap-[6px] mb-[10px]">
            <User size={14} className="opacity-30 flex-shrink-0 mt-[2px]" />
            <span
              className={`text-[14px] break-words ${
                (
                  Array.isArray(place?.target_name)
                    ? place.target_name.length > 0
                    : isValidInfo(place?.target_name)
                )
                  ? 'opacity-70'
                  : 'opacity-30'
              }`}
            >
              {Array.isArray(place?.target_name)
                ? place.target_name.join(', ')
                : place?.target_name || '정보 없음'}
            </span>
          </div>

          {/* 요일 */}
          <div className="flex items-start gap-[6px] mb-[10px]">
            <Calendar size={14} className="opacity-30 flex-shrink-0 mt-[2px]" />
            <span
              className={`text-[14px] break-words ${
                isValidInfo(place?.meal_days?.join(', '))
                  ? 'opacity-70 cursor-pointer copy-link'
                  : 'opacity-30 cursor-default'
              }`}
              onClick={(e) => copyToClipboard(place?.meal_days?.join(', ') || '', e)}
            >
              {place?.meal_days?.join(', ') || '정보 없음'}
            </span>
          </div>

          {/* 급식 시간 */}
          <div className="flex items-center gap-[6px] mb-[10px]">
            <Clock size={14} className="opacity-30 flex-shrink-0" />
            <div className="flex-1 flex items-center gap-[6px]">
              {/* 중식/석식 라벨 (회색) */}
              {place?.meal_time && place.meal_time.length > 0 && (
                <span className={labelClass} style={labelStyle}>
                  {place.meal_time.join(', ')}
                </span>
              )}

              <span
                className={`text-[14px] leading-[1.35] break-words pt-[1px] ${
                  isValidInfo(place?.time)
                    ? 'opacity-70 cursor-pointer copy-link'
                    : 'opacity-30 cursor-default'
                }`}
                onClick={(e) => copyToClipboard(place?.time || '', e)}
              >
                {place?.time || '정보 없음'}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex justify-end gap-3 pt-2">
          {/* ⭐ 즐겨찾기 버튼 */}
          <button
            onClick={() => toggleFavorite(place, 'senior')}
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
            <CarFront size={16} color="white" />
            <span className="text-white" style={{ color: 'rgba(255,255,255,0.98)' }}>
              길찾기
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
