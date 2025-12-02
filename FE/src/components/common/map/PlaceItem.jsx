'use client';

import { MapPin, Phone, Star } from 'lucide-react';

export default function PlaceItem({ place, mode }) {
  if (mode === 'child') {
    return (
      <div className="bg-white border border-gray-stroke05 rounded-lg p-3 hover:shadow-card transition-shadow cursor-pointer">
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
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{place.phone}</span>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <span className="text-xs text-orange px-2 py-0.5 bg-orange/_05 rounded">
            {place.status}
          </span>
          {place.delivery && (
            <span className="text-xs text-main px-2 py-0.5 bg-main/_10 rounded">배달 가능</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-stroke05 rounded-lg p-3 hover:shadow-card transition-shadow cursor-pointer">
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
        <div className="text-gray-stroke50">{place.schedule}</div>
      </div>
      <div className="mt-2">
        <span className="text-xs text-orange px-2 py-0.5 bg-orange/_05 rounded">
          {place.status}
        </span>
      </div>
    </div>
  );
}
