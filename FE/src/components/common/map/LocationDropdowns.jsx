'use client';

import { useState, useEffect, useRef } from 'react';
import { REGIONS } from '../../../constants/region';
import { IconArrowDown } from '../../../utils/icons';

export default function LocationDropdowns({ sido, setSido, sigungu, setSigungu }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  const provs = [...new Set(REGIONS.map((r) => r.province).filter(Boolean))].sort();
  const dists = REGIONS.filter((r) => r.province === sido && r.district)
    .map((r) => r.district)
    .sort();

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(null);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

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
      {/* 시도 Dropdown */}
      <div className="relative">
        <button
          className="px-[10px] py-[5px] border border-black-_07 rounded-[5px] text-[14px] w-[130px] bg-[#ffffff] flex justify-between items-center hover:border-black-_10 transition-colors"
          onClick={() => setOpen(open === 'sido' ? null : 'sido')}
        >
          <span className={sido ? 'text-gray-800' : 'text-black-_40'}>{sido || '시도명'}</span>
          <span
            className={`text-gray-600 ${open === 'sido' ? 'rotate-180' : ''} transition-transform`}
          >
            <img src={IconArrowDown} alt="" />
          </span>
        </button>

        {open === 'sido' && (
          <ul className="absolute z-50 bg-[#ffffff] border border-black-_07 rounded-[5px] shadow-md mt-1 w-full max-h-[calc(7*32px)] overflow-auto  dropdown-scrollbar">
            <li
              className={`px-[10px] pt-[6px] pb-[5px] text-[14px] cursor-pointer dropdown-item ${sido === '' ? 'opacity-70' : 'opacity-30'}`}
              onClick={() => handleSelect('sido', '')}
            >
              전체
            </li>
            {provs.map((p) => (
              <li
                key={p}
                className={`px-[10px] py-[5px] text-[14px] cursor-pointer dropdown-item ${sido === p ? 'opacity-70' : 'opacity-30'}`}
                onClick={() => handleSelect('sido', p)}
              >
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 시군구 Dropdown */}
      <div className="relative">
        <button
          disabled={!sido}
          className="px-[10px] py-[5px] border border-black-_07 rounded-[5px] text-[14px] w-[90px] bg-[#ffffff] flex justify-between items-center hover:border-black-_10 transition-colors disabled:text-black-_40 disabled:bg-[#ffffff] disabled:cursor-not-allowed"
          onClick={() => sido && setOpen(open === 'sigungu' ? null : 'sigungu')}
        >
          <span className={sigungu ? 'text-gray-800' : 'text-black-_40'}>
            {sigungu || '시군구명'}
          </span>
          <span
            className={`text-gray-600 ${open === 'sigungu' ? 'rotate-180' : ''} transition-transform`}
          >
            <img src={IconArrowDown} alt="" />
          </span>
        </button>

        {open === 'sigungu' && (
          <ul className="text-[14px] absolute z-50 bg-[#ffffff] border border-black-_07 rounded-[5px] shadow-md mt-1 w-full max-h-[calc(7*32px)] overflow-auto  dropdown-scrollbar">
            <li
              className={`px-[10px] pt-[6px] pb-[5px] text-[14px] cursor-pointer dropdown-item ${sigungu === '' ? 'opacity-70' : 'opacity-30'}`}
              onClick={() => handleSelect('sigungu', '')}
            >
              전체
            </li>
            {dists.map((d) => (
              <li
                key={d}
                className={`px-[10px] py-[5px] text-[14px] cursor-pointer dropdown-item ${sigungu === d ? 'opacity-70' : 'opacity-30'}`}
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
