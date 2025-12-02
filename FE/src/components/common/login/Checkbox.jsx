'use client';

export default function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-[6px] cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
            checked
              ? 'bg-main border-main'
              : 'bg-white border-gray-stroke10 group-hover:border-gray-stroke20'
          }`}
        >
          {checked && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 10L8.5 13.5L15 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {/* 💡 수정됨: group-hover:text-black-_50 및 transition-colors 추가 */}
      <span className="text-[14px] leading-[140%] tracking-[-0.025em] text-black-_30 group-hover:text-black-_50 transition-colors select-none">
        {label}
      </span>
    </label>
  );
}
