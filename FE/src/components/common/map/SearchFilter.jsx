'use client';

// ❌ 기존: import { CHILD_FILTERS, SENIOR_FILTERS } from ...
// ✅ 수정: SENIOR_FILTERS 삭제 (파일에 없으니까 가져오면 에러남)
import { CHILD_FILTERS } from '../../../constants/filters';

export default function SearchFilter({ mode, selectedFilters, onFilterToggle }) {
  // Sidebar에서 mode === 'child'일 때만 이 컴포넌트를 부르도록 했으므로,
  // 여기서는 무조건 CHILD_FILTERS만 쓰면 됩니다.
  const filters = CHILD_FILTERS;

  return (
    <div className="p-4 border-b border-gray-stroke05">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterToggle(filter.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedFilters.includes(filter.id)
                ? 'bg-main text-white'
                : 'bg-gray-stroke03 text-gray-stroke60 hover:bg-gray-stroke05'
            }`}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
