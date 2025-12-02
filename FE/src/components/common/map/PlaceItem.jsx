'use client';

import { MapPin, Phone, Star } from 'lucide-react';

export default function PlaceItem({ place, mode, isSelected, onSelect }) {
  const isChildMode = mode === 'child';

  const handleClick = () => {
    onSelect(place);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white border border-gray-stroke05 rounded-lg p-3 
        hover:shadow-card transition-shadow cursor-pointer 
        ${isSelected ? 'border-2 border-primary-green-dark shadow-lg' : ''} 
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-sm">{place.name}</h4>
        <button className="text-gray-stroke30 hover:text-star">
          <Star className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 text-xs text-gray-stroke60">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{place.address}</span>
        </div>

        {isChildMode ? (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{place.phone}</span>
          </div>
        ) : (
          <div className="text-gray-stroke50 pl-4">{place.schedule}</div>
        )}
      </div>

      <div className="mt-2 flex gap-2 text-xs font-bold">
        {place.isOpen ? (
          <span className="text-orange">영업 중</span>
        ) : (
          <span className="text-gray-400">영업 종료</span>
        )}

        {isChildMode && place.delivery && <span className="text-orange">배달 가능</span>}
      </div>
    </div>
  );
}
