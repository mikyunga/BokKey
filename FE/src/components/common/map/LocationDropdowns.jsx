'use client';

export default function LocationDropdowns({ sido, setSido, sigungu, setSigungu }) {
  return (
    <div className="flex gap-2 mb-3">
      <select
        value={sido}
        onChange={(e) => setSido(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-stroke10 rounded-lg text-sm"
      >
        <option value="">시도명</option>
        <option value="서울">서울</option>
        <option value="경기">경기</option>
        <option value="강원">강원</option>
        <option value="충북">충북</option>
        <option value="충남">충남</option>
        <option value="전북">전북</option>
        <option value="전남">전남</option>
        <option value="경북">경북</option>
        <option value="경남">경남</option>
        <option value="제주">제주</option>
      </select>
      <select
        value={sigungu}
        onChange={(e) => setSigungu(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-stroke10 rounded-lg text-sm"
      >
        <option value="">시군구명</option>
        <option value="강남구">강남구</option>
        <option value="강동구">강동구</option>
        <option value="강북구">강북구</option>
        <option value="강서구">강서구</option>
      </select>
    </div>
  );
}
