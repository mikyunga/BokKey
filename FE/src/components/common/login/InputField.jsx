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
}) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-4 rounded-xl border border-gray-stroke05 bg-white text-sm placeholder:text-gray-stroke30 focus:outline-none focus:border-main transition-colors"
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-stroke30 hover:text-gray-stroke50 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
