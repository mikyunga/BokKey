'use client';

import { MapPin, Phone, Star } from 'lucide-react';

export default function PlaceItem({ place, mode }) {
  // 1. 아동 급식카드 모드 (Child Mode)
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

        {/* ✅ 수정된 부분: 배경색 제거, 주황색 텍스트로 통일, isOpen 사용 */}
        <div className="mt-2 flex gap-2 text-xs font-bold">
          {place.isOpen && <span className="text-orange">영업 중</span>}
          {place.delivery && <span className="text-orange">배달 가능</span>}
        </div>
      </div>
    );
  }

  // 2. 노인 무료급식소 모드 (Senior Mode)
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
        {/* 노인 모드는 schedule(운영시간) 정보가 있으면 보여줌 */}
        <div className="text-gray-stroke50 pl-4">{place.schedule}</div>
      </div>

      {/* ✅ 수정된 부분: 배경색 제거, 주황색 텍스트로 통일, isOpen 사용 */}
      <div className="mt-2 flex gap-2 text-xs font-bold">
        {place.isOpen && <span className="text-orange">영업 중</span>}
      </div>
    </div>
  );
}
