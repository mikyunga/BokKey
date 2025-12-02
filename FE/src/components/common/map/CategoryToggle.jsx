'use client';

import { Check } from 'lucide-react';

export default function CategoryToggle({ mode, onModeChange }) {
  return (
    <div className="absolute top-4 right-4 z-40 flex gap-2 bg-[#ffffff] rounded-full shadow-custom p-1">
      <button
        onClick={() => onModeChange('child')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors
          ${mode === 'child' ? 'bg-main text-white' : 'bg-[#ffffff] text-black'}
        `}
      >
        {mode === 'child' && <Check className="w-4 h-4" />}
        급식카드
      </button>

      <button
        onClick={() => onModeChange('senior')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors
          ${mode === 'senior' ? 'bg-main text-white' : 'bg-[#ffffff] text-black'}
        `}
      >
        {mode === 'senior' && <Check className="w-4 h-4" />}
        무료급식소
      </button>
    </div>
  );
}
