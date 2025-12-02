'use client';

import { Check } from 'lucide-react'; // ✅ Check 아이콘 import

export default function CategoryToggle({ mode, onModeChange }) {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white rounded-full shadow-custom p-1">
      {/* ⚠️ 참고: `shadow-custom`과 `bg-white`는 기존 코드에 없었으나 
         토글 스위치 디자인을 위해 추가했습니다. (스크린샷에 기반하여) */}

      {/* 급식카드 버튼 */}
      <button
        onClick={() => onModeChange('child')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-colors 
          flex items-center justify-center whitespace-nowrap
          ${mode === 'child' ? 'bg-main text-white' : 'text-gray-stroke60 hover:text-black'}`}
      >
        {/* ✅ 활성화 시에만 Check 아이콘 표시 */}
        {mode === 'child' && <Check className="w-4 h-4 mr-1" />}
        급식카드
      </button>

      {/* 무료급식소 버튼 */}
      <button
        onClick={() => onModeChange('senior')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-colors 
          flex items-center justify-center whitespace-nowrap
          ${mode === 'senior' ? 'bg-white text-black' : 'text-gray-stroke60 hover:text-black'}`}
      >
        {/* ✅ 활성화 시에만 Check 아이콘 표시 */}
        {mode === 'senior' && <Check className="w-4 h-4 mr-1" />}
        무료급식소
      </button>
    </div>
  );
}
