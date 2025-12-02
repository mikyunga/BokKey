'use client';

import { CHILD_FILTERS, SENIOR_FILTERS } from '../../../constants/filters';

export default function SearchFilter({ mode, selectedFilters, onFilterToggle }) {
  const filters = mode === 'child' ? CHILD_FILTERS : SENIOR_FILTERS;

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
