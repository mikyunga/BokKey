// LocationDropdowns.jsx
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
    <div className="flex gap-2">
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
