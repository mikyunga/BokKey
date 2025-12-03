'use client';

import { CHILD_FILTERS } from '../../../constants/filters';

const categoryColors = {
  음식점: '#FF5E5E',
  편의점: '#FF9019',
  패스트푸드: '#65CC21',
  카페: '#3CB4FF',
  베이커리: '#2D48E3',
  마트: '#C66AF0',
};

function hexToRgba(hex, opacity) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}

export default function SearchFilter({ mode, selectedFilters, onFilterToggle }) {
  const filters = CHILD_FILTERS;

  return (
    <div className="p-4 border-b border-gray-stroke05">
      <div className="flex flex-wrap gap-1.5 items-center justify-center">
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);
          const category = filter.label || '';
          const borderColor =
            isSelected && categoryColors[category]
              ? hexToRgba(categoryColors[category], 0.15)
              : 'rgba(0,0,0,0.05)';
          const textColorStyle =
            isSelected && categoryColors[category] ? { color: categoryColors[category] } : null;
          const borderStyle = `1px solid ${borderColor}`;

          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`px-[10px] py-[6px] text-[14px] flex items-center gap-1 rounded-[5px] ${!isSelected ? 'text-black-_70' : ''}`}
              style={{ backgroundColor: 'transparent', border: borderStyle, ...textColorStyle }}
            >
              <filter.icon size={16} />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
