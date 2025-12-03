'use client';

import { useState, useEffect, useRef } from 'react';
import { REGIONS } from '../../../constants/region';
import { IconArrowDown } from '../../../utils/icons';

export default function LocationDropdowns({ sido, setSido, sigungu, setSigungu }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const selectedSidoRef = useRef(null);
  const selectedSigunguRef = useRef(null);

  const provs = [...new Set(REGIONS.map((r) => r.province).filter(Boolean))].sort();
  const dists = REGIONS.filter((r) => r.province === sido && r.district)
    .map((r) => r.district)
    .sort();

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(null);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (open === 'sido' && selectedSidoRef.current) {
      selectedSidoRef.current.scrollIntoView({ block: 'center' });
    }
    if (open === 'sigungu' && selectedSigunguRef.current) {
      selectedSigunguRef.current.scrollIntoView({ block: 'center' });
    }
  }, [open]);

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
          <span style={{ color: sido ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)' }}>
            {sido || '시도명'}
          </span>
          <span
            className={`text-gray-600 ${open === 'sido' ? 'rotate-180' : ''} transition-transform`}
          >
            <img src={IconArrowDown} alt="" />
          </span>
        </button>

        {open === 'sido' && (
          <ul className="absolute z-50 bg-[#ffffff] border border-black-_07 rounded-[5px] shadow-dropDown mt-1 w-full max-h-[calc(7*32px)] overflow-auto  dropdown-scrollbar">
            <li
              ref={sido === '' ? selectedSidoRef : null}
              className="px-[10px] pt-[6px] pb-[5px] text-[14px] cursor-pointer dropdown-item border-b border-gray-200"
              onClick={() => handleSelect('sido', '')}
              style={{
                borderBottomWidth: '1px',
                color: sido === '' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
                backgroundColor: sido === '' ? 'rgba(0,0,0,0.0)' : undefined,
              }}
            >
              전체
            </li>
            {provs.map((p, index) => (
              <li
                key={p}
                ref={sido === p ? selectedSidoRef : null}
                className="px-[10px] py-[5px] text-[14px] cursor-pointer dropdown-item border-b border-gray-200"
                onClick={() => handleSelect('sido', p)}
                style={{
                  borderBottomWidth: '1px',
                  color: sido === p ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
                  backgroundColor: sido === p ? 'rgba(0,0,0,0.0)' : undefined,
                }}
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
          <span style={{ color: sigungu ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)' }}>
            {sigungu || '시군구명'}
          </span>
          <span
            className={`text-gray-600 ${open === 'sigungu' ? 'rotate-180' : ''} transition-transform`}
          >
            <img src={IconArrowDown} alt="" />
          </span>
        </button>

        {open === 'sigungu' && (
          <ul className="text-[14px] absolute z-50 bg-[#ffffff] border border-black-_07 rounded-[5px] shadow-dropDown mt-1 w-full max-h-[calc(7*32px)] overflow-auto  dropdown-scrollbar">
            <li
              ref={sigungu === '' ? selectedSigunguRef : null}
              className="px-[10px] pt-[6px] pb-[5px] text-[14px] cursor-pointer dropdown-item border-b border-gray-200"
              onClick={() => handleSelect('sigungu', '')}
              style={{
                borderBottomWidth: '1px',
                color: sigungu === '' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
                backgroundColor: sigungu === '' ? 'rgba(0,0,0,0.0)' : undefined,
              }}
            >
              전체
            </li>
            {dists.map((d, index) => (
              <li
                key={d}
                ref={sigungu === d ? selectedSigunguRef : null}
                className="px-[10px] py-[5px] text-[14px] cursor-pointer dropdown-item border-b border-gray-200"
                onClick={() => handleSelect('sigungu', d)}
                style={{
                  borderBottomWidth: '1px',
                  color: sigungu === d ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
                  backgroundColor: sigungu === d ? 'rgba(0,0,0,0.0)' : undefined,
                }}
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
