'use client';

import { useEffect, useRef, useState } from 'react';

export default function MapContainer({ mode, places }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersRef = useRef([]); // 마커들을 관리할 배열

  // 1. 지도 초기화 (최초 1회)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      setMapInstance(map);
      console.log('지도 로드 완료');
    }
  }, []);

  // 2. 마커 렌더링 (places 데이터가 바뀔 때마다 실행)
  useEffect(() => {
    if (!mapInstance || !places) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 지도 범위 재설정을 위한 Bounds 객체 생성
    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      if (place.latitude && place.longitude) {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: mapInstance,
          title: place.name, // 마우스 오버 시 이름 표시
        });

        markersRef.current.push(marker);
        bounds.extend(position); // 범위에 좌표 추가
      }
    });

    // 마커가 1개 이상일 때만 지도 범위 재설정
    if (markersRef.current.length > 0) {
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, places]); // places가 바뀌면 실행됨

  return <div ref={mapRef} className="w-full h-full" />;
}
