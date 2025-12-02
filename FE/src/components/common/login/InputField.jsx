'use client';

import { Eye, EyeOff } from 'lucide-react';

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
        className={`w-full h-[51px] px-[16px] py-[14px] outline-none border border-gray-stroke05 rounded-[8px] bg-white 
          placeholder-gray-stroke30 tracking-[-0.025em] focus:border-main 
          transition-all duration-300 ease-in-out
          focus:placeholder:opacity-0 [&::placeholder]:transition-opacity [&::placeholder]:duration-300
          ${className}`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // 포커스 유지
          onClick={onTogglePassword}
          className="absolute right-[16px] top-1/2 -translate-y-1/2 z-20 text-gray-stroke30 hover:text-gray-stroke50 transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
