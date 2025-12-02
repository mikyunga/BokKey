'use client';

export default function CategoryToggle({ mode, onModeChange }) {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white rounded-full shadow-custom p-1">
      <button
        onClick={() => onModeChange('child')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === 'child' ? 'bg-main text-white' : 'text-gray-stroke60 hover:text-black'
        }`}
      >
        급식카드
      </button>
      <button
        onClick={() => onModeChange('senior')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === 'senior' ? 'bg-main text-white' : 'text-gray-stroke60 hover:text-black'
        }`}
      >
        무료급식소
      </button>
    </div>
  );
}
