'use client';

import { REGIONS } from '../../../constants/region';

export default function LocationDropdowns({ sido, setSido, sigungu, setSigungu }) {
  // 1. 중복 제거된 시도 목록 추출
  const sidoOptions = [...new Set(REGIONS.map((r) => r.province).filter(Boolean))].sort();

  // 2. 선택된 시도에 해당하는 시군구 목록 추출
  const sigunguOptions = REGIONS.filter((r) => r.province === sido && r.district) // 시도가 맞고, 시군구가 있는 경우만
    .map((r) => r.district)
    .sort();

  const handleSidoChange = (e) => {
    setSido(e.target.value);
    setSigungu(''); // 시도가 바뀌면 시군구 초기화
  };

  return (
    <div className="flex gap-2">
      {/* 시도 선택 */}
      <select
        value={sido}
        onChange={handleSidoChange}
        className="flex-1 px-3 py-2 border border-gray-stroke10 rounded-lg text-sm min-w-[100px]"
      >
        <option value="">시도명</option>
        {sidoOptions.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      {/* 시군구 선택 */}
      <select
        value={sigungu}
        onChange={(e) => setSigungu(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-stroke10 rounded-lg text-sm min-w-[100px]"
      >
        <option value="">시군구명</option>
        {sigunguOptions.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  );
}
