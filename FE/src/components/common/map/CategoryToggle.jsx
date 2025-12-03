'use client';
import { Check } from 'lucide-react';

// 선택된 버튼: 초록색 틴트 그림자
const BRAND_SHADOW = 'shadow-[0_1px_5px_0_rgba(149,215,105,0.8)]';
// 선택 안 된 버튼: 검정색 그림자
const BLACK_SHADOW = 'shadow-[0_1px_5px_0_rgba(0,0,0,0.15)]';

export default function CategoryToggle({ mode, onModeChange }) {
  const isActive = (type) => mode === type;

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      {/* 1. 급식카드 버튼 */}
      <button
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={() => onModeChange('child')}
        className={`
          flex items-center gap-1 
          pr-[12px] pl-[10px] py-[8px]
          rounded-full text-[14px] whitespace-nowrap
          transition-all bg-white
          ${isActive('child') ? BRAND_SHADOW : BLACK_SHADOW}
          ${
            isActive('child')
              ? `outline outline-1 outline-[#95D769] font-medium text-black`
              : `outline outline-1 outline-[rgba(149,215,105,0)] text-gray-stroke30`
          }
        `}
      >
        <Check
          className={`w-4 h-4 transition ${isActive('child') ? 'text-black' : 'text-gray-300'}`}
        />
        급식카드
      </button>

      {/* 2. 무료급식소 버튼 */}
      <button
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={() => onModeChange('senior')}
        className={`
          flex items-center gap-1 
          pr-[12px] pl-[10px] py-[8px]
          rounded-full text-[14px] whitespace-nowrap
          transition-all bg-white
          ${isActive('senior') ? BRAND_SHADOW : BLACK_SHADOW}
          ${
            isActive('senior')
              ? `outline outline-1 outline-[#95D769] font-medium text-black`
              : `outline outline-1 outline-[rgba(149,215,105,0)] text-gray-stroke30`
          }
        `}
      >
        <Check
          className={`w-4 h-4 transition ${isActive('senior') ? 'text-black' : 'text-gray-300'}`}
        />
        무료급식소
      </button>
    </div>
  );
}
