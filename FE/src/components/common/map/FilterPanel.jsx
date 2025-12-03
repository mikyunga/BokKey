'use client';

import { useState } from 'react';
import { IconForwardMore } from '../../../utils/icons';

export default function FilterPanel({ onApply, onCancel, initialFilters }) {
  // ⭐ 1. 초기값을 null로 설정 (아무것도 선택 안 된 상태)
  const [filters, setFilters] = useState(
    initialFilters || {
      targets: [],
      days: [],
      times: [],
      region: null,
    }
  );

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  // ⭐ 2. 초기화 버튼 클릭 시에도 region을 null로 리셋
  const resetFilter = () => {
    setFilters({ targets: [], days: [], times: [], region: null });
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div
      style={{ backgroundColor: 'white' }}
      className="w-[330px] h-full p-5 shadow rounded-lg flex flex-col gap-6 z-[999]"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-[16px] font-semibold">상세 조건</h2>
        <button
          onClick={resetFilter}
          className="flex items-center gap-1"
          style={{
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <img src={IconForwardMore} alt="" className="w-2.5 opacity-30" />
          초기화
        </button>
      </div>

      {/* 구역 1: 급식 대상 */}
      <div className="">
        <h3 className="font-medium mb-2 text-[14px]">급식 대상</h3>
        <div className="flex flex-wrap gap-2">
          {['아동', '노인', '장애인'].map((label) => {
            const isSelected = filters.targets.includes(label);
            return (
              <button
                key={label}
                onClick={() =>
                  updateFilter(
                    'targets',
                    isSelected
                      ? filters.targets.filter((l) => l !== label)
                      : [...filters.targets, label]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {['노숙인', '취약계층', '국가유공자'].map((label) => {
            const isSelected = filters.targets.includes(label);
            return (
              <button
                key={label}
                onClick={() =>
                  updateFilter(
                    'targets',
                    isSelected
                      ? filters.targets.filter((l) => l !== label)
                      : [...filters.targets, label]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 구역 2: 요일 */}
      <div className="">
        <h3 className="font-medium mb-2 text-[14px]">요일</h3>
        <div className="inline-flex flex-wrap gap-2 max-w-max">
          {['월', '화', '수', '목', '금', '토', '일'].map((d) => {
            const isSelected = filters.days.includes(d);
            return (
              <button
                key={d}
                onClick={() =>
                  updateFilter(
                    'days',
                    isSelected ? filters.days.filter((x) => x !== d) : [...filters.days, d]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* 구역 3: 시간 */}
      <div className="">
        <h3 className="font-medium mb-2 text-[14px]">시간</h3>
        <div className="flex gap-2 flex-wrap">
          {['조식', '중식', '석식'].map((t) => {
            const isSelected = filters.times.includes(t);
            return (
              <button
                key={t}
                onClick={() =>
                  updateFilter(
                    'times',
                    isSelected ? filters.times.filter((x) => x !== t) : [...filters.times, t]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 구역 4: 지역 */}
      <div className="">
        <h3 className="font-medium mb-2 text-[14px]">지역</h3>
        <div className="flex gap-2">
          {[
            { id: 'nationwide', label: '전국' },
            { id: 'regional', label: '지역 한정' },
          ].map((r) => {
            const isSelected = filters.region === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  // ⭐ 3. 토글 기능: 이미 선택된 걸 누르면 해제(null), 아니면 선택
                  updateFilter('region', isSelected ? null : r.id);
                }}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 mt-auto">
        <button
          onClick={onCancel}
          className="rounded-full px-4 py-2"
          style={{ fontSize: '14px', color: '#78C347', backgroundColor: 'rgba(120,195,71,0.1)' }}
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
