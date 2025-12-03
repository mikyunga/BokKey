import { useState } from 'react';
import { IconForwardMore } from '../../../utils/icons';

export default function FilterPanel({ places, onFiltered, onCancel }) {
  const [filters, setFilters] = useState({
    targets: [],
    days: [],
    times: [],
    region: '전국',
  });

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  // 조건 체크 함수들 ----------------
  const checkTarget = (p) =>
    filters.targets.length === 0 || p.targets?.some((t) => filters.targets.includes(t));

  const checkRegion = (p) => filters.region === '전국' || p.region_code === filters.region;

  const checkDay = (p) =>
    filters.days.length === 0 || filters.days.some((d) => p.meal_days?.includes(d));

  const checkTime = (p) =>
    filters.times.length === 0 || filters.times.some((t) => p.meal_time?.includes(t));

  const applyFilter = () => {
    const result = places.filter(
      (p) => checkTarget(p) && checkRegion(p) && checkDay(p) && checkTime(p)
    );
    // Do NOT reset filters; just call onFiltered
    onFiltered(result);
  };

  const resetFilter = () => {
    setFilters({ targets: [], days: [], times: [], region: '전국' });
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
                    filters.targets.includes(label)
                      ? filters.targets.filter((l) => l !== label)
                      : [...filters.targets, label]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.20)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)';
                  }
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
                    filters.targets.includes(label)
                      ? filters.targets.filter((l) => l !== label)
                      : [...filters.targets, label]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.20)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)';
                  }
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
                    filters.days.includes(d)
                      ? filters.days.filter((x) => x !== d)
                      : [...filters.days, d]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.20)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)';
                  }
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
                    filters.times.includes(t)
                      ? filters.times.filter((x) => x !== t)
                      : [...filters.times, t]
                  )
                }
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.20)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)';
                  }
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
                onClick={() => updateFilter('region', r.id)}
                className="rounded-[6px] text-[14px] transition-all flex items-center gap-1"
                style={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                  border: isSelected
                    ? '1px solid rgba(149,215,105,0.7)'
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isSelected ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.20)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)';
                  }
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-full px-4 py-2"
          style={{ fontSize: '14px', color: '#78C347', backgroundColor: 'rgba(120,195,71,0.1)' }}
        >
          취소
        </button>
        <button
          onClick={applyFilter}
          className="bg-[#78C347] px-4 py-2 rounded-full"
          style={{ fontSize: '14px', color: 'white' }}
        >
          완료
        </button>
      </div>
    </div>
  );
}
