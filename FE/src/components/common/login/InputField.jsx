'use client';

import { Eye, EyeOff } from 'lucide-react';

// className: input 태그에 적용될 스타일 (둥글기 제어용)
// wrapperClassName: 감싸는 div에 적용될 스타일 (마진 겹침 제어용)
export default function InputField({
  placeholder,
  value,
  onChange,
  type = 'text',
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  className = '',
  wrapperClassName = '',
}) {
  return (
    <div className={`relative w-full ${wrapperClassName}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // 외부에서 전달받은 className을 뒤에 붙여서 기존 스타일을 덮어쓸 수 있게 함
        className={`w-full h-[51px] px-[16px] py-[14px] outline-none border border-gray-stroke05 rounded-[8px] bg-white placeholder-gray-stroke30 tracking-[-0.025em] focus:border-main transition-colors ${className}`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-[16px] top-1/2 -translate-y-1/2 text-gray-stroke30 hover:text-gray-stroke50 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
