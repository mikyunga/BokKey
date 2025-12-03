'use client';

import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="장소를 입력해주세요."
        className="w-full px-4 py-[10px] pr-9 
                   bg-[rgba(0,0,0,0.015)] 
                   border border-[rgba(0,0,0,0.02)] rounded-full 
                   text-[16px] placeholder:text-[rgba(0,0,0,0.5)] 
                   focus:outline-none focus:placeholder:text-[rgba(0,0,0,0)] 
                   focus:shadow-[0_1px_4px_rgba(0,0,0,0.03)] 
                   focus:bg-white focus:border-[rgba(0,0,0,0.05)] 
                   transition-colors duration-200 hover:shadow-sm"
      />
      <Search
        strokeWidth={1.75}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.5)]"
      />
    </div>
  );
}
