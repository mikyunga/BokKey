'use client';

import { REGIONS } from '../../../constants/region';

export default function LocationDropdowns({ sido, setSido, sigungu, setSigungu }) {
  const sidoOptions = [...new Set(REGIONS.map((r) => r.province).filter(Boolean))].sort();

  const sigunguOptions = REGIONS.filter((r) => r.province === sido && r.district)
    .map((r) => r.district)
    .sort();

  const handleSidoChange = (e) => {
    setSido(e.target.value);
    setSigungu('');
  };

  return (
    // 이 컨테이너는 이제 유연한 너비를 가집니다.
    <div className="flex gap-2">
      {/* 1. 시도 선택 */}
      <select
        value={sido}
        onChange={handleSidoChange}
        // ✅ 수정: flex-1 제거! -> 내용물 길이에 맞춰 너비가 결정됩니다.
        className="px-3 py-2 border border-gray-stroke10 rounded-lg text-sm"
      >
        <option value="">시도명</option>
        {sidoOptions.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      {/* 2. 시군구 선택 */}
      <select
        value={sigungu}
        onChange={(e) => setSigungu(e.target.value)}
        // ✅ 수정: flex-1 제거! -> 내용물 길이에 맞춰 너비가 결정됩니다.
        className="px-3 py-2 border border-gray-stroke10 rounded-lg text-sm"
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
