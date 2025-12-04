'use client';

import { MapPin, Phone, User, Clock } from 'lucide-react';

export default function SeniorDetailPanel({ place, isCollapsed, onToggleCollapse, onClose }) {
  return (
    <div className="h-fit w-full bg-white border-l border-gray-200 shadow-xl transition-all duration-300">
      <button
        onClick={onToggleCollapse}
        className="absolute top-4 left-3 p-1 hover:bg-black/5 rounded-full"
      >
        {isCollapsed ? '⮟' : '⮝'}
      </button>

      {!isCollapsed && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full"
        >
          ✕
        </button>
      )}

      {!isCollapsed && place && (
        <div className="p-6 overflow-y-auto h-fit">
          <h2 className="text-xl font-semibold mb-4">{place.name}</h2>

          {/* 급식소 안내 */}
          <div className="mb-4 text-[15px]">
            <div className="font-semibold text-orange-600 mb-1">급식소 안내</div>

            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <MapPin size={16} />
              <span>{place.address}</span>
            </div>

            <div className="text-gray-500 ml-6 mb-1">{place.lotAddress}</div>

            <div className="flex items-center gap-2 text-gray-700">
              <Phone size={16} />
              <span>{place.phone || '정보 없음'}</span>
            </div>
          </div>

          {/* 조건 */}
          <div className="mb-4">
            <div className="font-semibold text-orange-600 mb-1">이용 조건</div>
            <div className="flex items-center gap-2 text-gray-700">
              <User size={16} />
              {place.target_name.join(', ')}
            </div>
          </div>

          {/* 요일/시간 */}
          <div className="mb-4">
            <div className="font-semibold text-orange-600 mb-1">급식 제공 요일</div>
            <div className="ml-6 text-gray-700">{place.meal_days.join(', ')}</div>
          </div>

          <div className="mb-4">
            <div className="font-semibold text-orange-600 mb-1">시간</div>
            <div className="flex items-center gap-2 ml-6 text-gray-700">
              <Clock size={16} />
              {place.meal_time.join(', ')}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 mt-6">
            <button className="px-4 py-2 bg-white border rounded-full">⭐ 즐겨찾기</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-full">🧭 길찾기</button>
          </div>
        </div>
      )}
    </div>
  );
}
