'use client';

import { useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconLogo } from '../../../utils/icons';
import SearchBar from './SearchBar';
import LocationDropdowns from './LocationDropdowns';
import SearchFilter from './SearchFilter';
import PlaceList from './PlaceList';

export default function Sidebar({
  mode,
  showFavorites,
  onCloseFavorites,
  places,

  sido,
  setSido,
  sigungu,
  setSigungu,
  searchQuery,
  setSearchQuery,
  selectedFilters,
  setSelectedFilters,
  selectedPlace,
  setSelectedPlace, // ⭐ 이게 핵심!

  showOpenOnly,
  setShowOpenOnly,
  showDeliveryOnly,
  setShowDeliveryOnly,

  onOpenFilter,
  onOpenRegionSelect,
  onHeaderHeightChange,
  detailFilterActive,
  setDetailFilterActive,
  onSelectFromFavorites,
}) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(headerRef.current?.offsetHeight || 0);
    }
  }, []);

  const handleOpenFilter = (pos) => {
    if (onOpenFilter) onOpenFilter(pos);
  };

  return (
    <div className="w-[380px] h-full bg-[#ffffff] shadow-custom-drop flex flex-col z-30 flex-shrink-0">
      {showFavorites ? (
        <div className="px-6 py-5 border-b border-gray-stroke05 flex items-center justify-center gap-3 relative">
          <button
            onClick={onCloseFavorites}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors absolute left-6 top-1/2 -translate-y-1/2"
          >
            <ArrowLeft size={20} className="text-black" />
          </button>
          <h2 className="text-[18px] font-bold flex items-center gap-2">
            즐겨찾기
            <span className="text-[#78C347] text-[16px] font-bold bg-black-buttonFill px-1 rounded-[5px]">
              {places.length}건
            </span>
          </h2>
        </div>
      ) : (
        <div ref={headerRef} className="px-6 pt-6 pb-4 p-4 border-b border-gray-stroke05">
          <div className="flex items-center justify-between mb-4">
            <img src={IconLogo} alt="복키 로고" className="h-[24px] object-contain flex-shrink-0" />

            <div className="flex-shrink-0">
              <LocationDropdowns
                sido={sido}
                setSido={setSido}
                sigungu={sigungu}
                setSigungu={setSigungu}
              />
            </div>
          </div>

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {mode === 'child' && (
            <SearchFilter
              selectedFilters={selectedFilters}
              onFilterToggle={(id) => {
                setSelectedFilters((prev) => (prev.includes(id) ? [] : [id]));
              }}
            />
          )}
        </div>
      )}

      {/* ⭐ PlaceList에 onSelectPlace 전달! */}
      <PlaceList
        mode={mode}
        places={places}
        selectedPlace={selectedPlace}
        onSelectPlace={setSelectedPlace} // ⭐ 이 줄이 핵심!
        isFavoritesMode={showFavorites}
        showOpenOnly={showOpenOnly}
        setShowOpenOnly={setShowOpenOnly}
        showDeliveryOnly={showDeliveryOnly}
        setShowDeliveryOnly={setShowDeliveryOnly}
        onOpenFilter={handleOpenFilter}
        detailFilterActive={detailFilterActive}
        setDetailFilterActive={setDetailFilterActive}
      />
    </div>
  );
}
