'use client';

import { useState, useEffect, useRef } from 'react';
import { REGIONS } from '../../../constants/region';

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

  return (
    <div className="flex gap-2" ref={ref}>
      <div className="relative">
        <button
          className="px-3 py-2 border border-gray-stroke10 rounded-lg text-sm w-[140px] bg-[#ffffff] flex justify-between items-center"
          onClick={() => setOpen(open === 'sido' ? null : 'sido')}
        >
          {sido || '시도명'}
          <span className={open === 'sido' ? 'rotate-180' : ''}>▲</span>
        </button>

        {open === 'sido' && (
          <ul className="absolute z-50 bg-[#ffffff] border border-gray-stroke10 rounded-xl shadow-xl mt-1 w-full max-h-56 overflow-auto">
            {provs.map((p) => (
              <li
                key={p}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSido(p);
                  setSigungu('');
                  setOpen(null);
                }}
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
          className={`px-3 py-2 border border-gray-stroke10 rounded-lg text-sm w-[140px] flex justify-between items-center
            ${!sido ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'bg-[#ffffff]'}`}
          onClick={() => sido && setOpen(open === 'sigungu' ? null : 'sigungu')}
        >
          {sigungu || '시군구명'}
          <span className={!sido ? 'opacity-40' : open === 'sigungu' ? 'rotate-180' : ''}>▼</span>
        </button>

        {open === 'sigungu' && (
          <ul className="absolute z-50 bg-[#ffffff] border border-gray-stroke10 rounded-xl shadow-xl mt-1 w-full max-h-56 overflow-auto">
            {dists.map((d) => (
              <li
                key={d}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSigungu(d);
                  setOpen(null);
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
