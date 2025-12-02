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
        className="w-full px-3 py-2 pr-10 border border-gray-stroke10 rounded-lg text-sm placeholder:text-gray-stroke30"
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-stroke30" />
    </div>
  );
}
