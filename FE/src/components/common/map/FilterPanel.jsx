'use client';

import { useState } from 'react';
import { IconForwardMore } from '../../../utils/icons';

export default function FilterPanel({ onApply, onCancel, initialFilters }) {
  const [filters, setFilters] = useState(
    initialFilters || { targets: [], days: [], times: [], region: null }
  );

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilter = () => setFilters({ targets: [], days: [], times: [], region: null });

  const handleApply = () => {
    onApply(filters);
  };

  const buttonStyle = (selected) => ({
    padding: '6px 10px',
    backgroundColor: '#FFFFFF',
    border: selected ? '1px solid rgba(149,215,105,0.7)' : '1px solid rgba(0,0,0,0.08)',
    color: selected ? '#000' : 'rgba(0,0,0,0.5)',
    transition: 'all 0.2s',
  });

  const handleMouseEnter = (e, selected) => {
    if (!selected) {
      e.currentTarget.style.border = '1px solid rgba(0,0,0,0.15)';
      e.currentTarget.style.color = 'rgba(0,0,0,0.65)';
    }
  };

  const handleMouseLeave = (e, selected) => {
    if (!selected) {
      e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)';
      e.currentTarget.style.color = 'rgba(0,0,0,0.5)';
    }
  };

  return (
    <div
      style={{ backgroundColor: 'white' }}
      className="w-[330px] h-fit p-5 shadow rounded-lg flex flex-col gap-6 z-[999]"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-[16px] font-semibold">상세 조건</h2>

        <button
          onClick={resetFilter}
          className="flex items-center gap-1"
          style={{
            fontSize: '12px',
            color: 'rgba(0,0,0,0.3)',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <img src={IconForwardMore} alt="" className="w-2.5 opacity-30" />
          초기화
        </button>
      </div>

      {/* 급식 대상 */}
      <div>
        <h3 className="font-medium mb-2 text-[14px]">급식 대상</h3>

        <div className="flex flex-wrap gap-2">
          {['아동', '노인', '장애인'].map((label) => {
            const selected = filters.targets.includes(label);
            return (
              <button
                key={label}
                onClick={() =>
                  updateFilter(
                    'targets',
                    selected
                      ? filters.targets.filter((x) => x !== label)
                      : [...filters.targets, label]
                  )
                }
                style={buttonStyle(selected)}
                onMouseEnter={(e) => handleMouseEnter(e, selected)}
                onMouseLeave={(e) => handleMouseLeave(e, selected)}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {['노숙인', '취약계층', '국가유공자'].map((label) => {
            const selected = filters.targets.includes(label);
            return (
              <button
                key={label}
                onClick={() =>
                  updateFilter(
                    'targets',
                    selected
                      ? filters.targets.filter((x) => x !== label)
                      : [...filters.targets, label]
                  )
                }
                style={buttonStyle(selected)}
                onMouseEnter={(e) => handleMouseEnter(e, selected)}
                onMouseLeave={(e) => handleMouseLeave(e, selected)}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 요일 */}
      <div>
        <h3 className="font-medium mb-2 text-[14px]">요일</h3>

        <div className="inline-flex flex-wrap gap-2 max-w-max">
          {['월', '화', '수', '목', '금', '토', '일'].map((d) => {
            const selected = filters.days.includes(d);
            return (
              <button
                key={d}
                onClick={() =>
                  updateFilter(
                    'days',
                    selected ? filters.days.filter((x) => x !== d) : [...filters.days, d]
                  )
                }
                style={buttonStyle(selected)}
                onMouseEnter={(e) => handleMouseEnter(e, selected)}
                onMouseLeave={(e) => handleMouseLeave(e, selected)}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* 시간 */}
      <div>
        <h3 className="font-medium mb-2 text-[14px]">시간</h3>

        <div className="flex gap-2 flex-wrap">
          {['조식', '중식', '석식'].map((t) => {
            const selected = filters.times.includes(t);
            return (
              <button
                key={t}
                onClick={() =>
                  updateFilter(
                    'times',
                    selected ? filters.times.filter((x) => x !== t) : [...filters.times, t]
                  )
                }
                style={buttonStyle(selected)}
                onMouseEnter={(e) => handleMouseEnter(e, selected)}
                onMouseLeave={(e) => handleMouseLeave(e, selected)}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 지역 범위 */}
      <div>
        <h3 className="font-medium mb-2 text-[14px]">지역</h3>

        <div className="flex gap-2">
          {[
            { id: 'nationwide', label: '전국' },
            { id: 'regional', label: '지역 한정' },
          ].map((r) => {
            const selected = filters.region === r.id;
            return (
              <button
                key={r.id}
                onClick={() => updateFilter('region', selected ? null : r.id)}
                style={buttonStyle(selected)}
                onMouseEnter={(e) => handleMouseEnter(e, selected)}
                onMouseLeave={(e) => handleMouseLeave(e, selected)}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-auto">
        <button
          onClick={onCancel}
          className="rounded-full px-4 py-2"
          style={{
            fontSize: '14px',
            color: '#78C347',
            backgroundColor: 'rgba(120,195,71,0.1)',
          }}
        >
          취소
        </button>

        <button
          onClick={handleApply}
          className="bg-[#78C347] px-4 py-2 rounded-full"
          style={{ fontSize: '14px', color: 'white' }}
        >
          완료
        </button>
      </div>
    </div>
  );
}
