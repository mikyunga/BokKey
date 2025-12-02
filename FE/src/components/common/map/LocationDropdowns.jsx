'use client';

import { useState, useEffect, useRef } from 'react';
import { REGIONS } from '../../../constants/region';
import { IconArrowDown } from '../../../utils/icons';

// ⚠️ 경로 확인: constants 폴더의 regions.js 경로에 맞게 조정하세요.

export default function LocationDropdowns({ sido, setSido, sigungu, setSigungu }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  // 시도 및 시군구 목록 추출 (이전과 동일)
  const provs = [...new Set(REGIONS.map((r) => r.province).filter(Boolean))].sort();
  const dists = REGIONS.filter((r) => r.province === sido && r.district)
    .map((r) => r.district)
    .sort();

  // 외부 클릭 시 닫기 로직 (Pop-over의 필수 기능)
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(null);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  // 옵션 선택 핸들러
  const handleSelect = (type, value) => {
    if (type === 'sido') {
      setSido(value);
      setSigungu('');
    } else {
      setSigungu(value);
    }
    setOpen(null);
  };

  return (
    <div className="flex gap-2" ref={ref}>
      <div className="relative">
        <button
          className="px-[10px] py-[6px] border border-black-_07 rounded-[5px] text-[14px] w-[140px] bg-[#ffffff] flex justify-between items-center  hover:border-black-_10 transition-colors"
          onClick={() => setOpen(open === 'sido' ? null : 'sido')}
        >
          {/* ✅ 폰트 스타일 변경: 선택 시 글씨 강조 (font-) */}
          <span className={sido ? ' text-gray-800' : 'text-black-_70'}>{sido || '시도명'}</span>
          <span
            className={`text-gray-600 ${open === 'sido' ? 'rotate-180' : ''} transition-transform`}
          >
            <img src={IconArrowDown} alt="" />
          </span>
        </button>

        {open === 'sido' && (
          <ul className="absolute z-50 bg-[#ffffff] border border-gray-stroke10 rounded-[5px] shadow-xl mt-1 w-full max-h-56 overflow-auto">
            {/* 시도 초기화 옵션 추가 */}
            <li
              className="px-[10px] py-[6px] text-[14px] cursor-pointer text-gray-500 hover:bg-black-_02"
              onClick={() => handleSelect('sido', '')}
            >
              초기화
            </li>
            {provs.map((p) => (
              <li
                key={p}
                className={`px-[10px] py-[6px] text-[14px] cursor-pointer hover:bg-gray-100 ${sido === p ? 'bg-gray-50 font-' : ''}`}
                onClick={() => handleSelect('sido', p)}
              >
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <button
          disabled={!sido}
          className={` px-[10px] py-[6px] border border-black-_07 rounded-[5px] text-[14px] w-[100px] flex justify-between items-center  hover:border-black-_10 transition-colors
            ${!sido ? 'text-black-_10 bg-black-_02 cursor-not-allowed' : 'bg-[#ffffff]'}`}
          onClick={() => sido && setOpen(open === 'sigungu' ? null : 'sigungu')}
        >
          {/* ✅ 폰트 스타일 변경: 선택 시 글씨 강조 (font-) */}
          <span className={sigungu ? 'font- text-gray-800' : 'text-black-_70'}>
            {sigungu || '시군구명'}
          </span>
          <span
            className={`text-black-_10 ${open === 'sigungu' ? 'rotate-180' : ''} transition-transform`}
          >
            <img src={IconArrowDown} alt="" />
          </span>
        </button>

        {open === 'sigungu' && (
          <ul className="absolute z-50 bg-[#ffffff]  border border-black-_07 rounded-[5px] shadow-xl mt-1 w-full max-h-56 overflow-auto">
            {/* 시군구 초기화 옵션 추가 */}
            <li
              className="px-[10px] py-[6px] text-[14px] cursor-pointer text-gray-500 hover:bg-gray-100"
              onClick={() => handleSelect('sigungu', '')}
            >
              초기화
            </li>
            {dists.map((d) => (
              <li
                key={d}
                className={`px-[10px] py-[6px] text-[14px] cursor-pointer hover:bg-gray-100 ${sigungu === d ? 'bg-gray-50 ' : ''}`}
                onClick={() => handleSelect('sigungu', d)}
              >
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
