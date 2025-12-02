'use client';

import { useEffect, useRef } from 'react';

export default function MapContainer({ mode }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오맵 API 초기화
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      console.log('[v0] 지도 초기화 완료, 모드:', mode);
    }
  }, [mode]);

  return <div ref={mapRef} className="w-full h-full" />;
}
