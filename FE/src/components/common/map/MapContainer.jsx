'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconBlue,
  IconGreen,
  IconOrange,
  IconPurple,
  IconRed,
  IconSkyblue,
} from '../../../utils/icons';

// ✅ 1. 카테고리별 마커 이미지 URL 매핑 정의
const CATEGORY_MARKERS = {
  restaurant: { url: IconRed },
  convenience: { url: IconOrange },
  fastfood: { url: IconGreen },
  cafe: { url: IconSkyblue },
  bakery: { url: IconBlue },
  mart: { url: IconPurple },
  welfare: { url: '/images/markers/grey_pin.png' }, // Welfare/기타는 기본 경로 유지
};

export default function MapContainer({ mode, places, selectedPlace }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersRef = useRef([]);

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
    }
  }, []);

  // 2. 마커 렌더링 (places가 바뀔 때)
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined' || !window.kakao.maps) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      if (place.latitude && place.longitude) {
        let markerImage = null; // ✅ 기본값: null (Kakao Maps 기본 핀 사용)

        // ✅ 2-1. 핀 색상 커스텀은 아동 급식카드 모드일 때만 적용합니다.
        if (mode === 'child') {
          const categoryKey = place.category || 'restaurant'; // 카테고리 누락 시 'restaurant' 기본값 사용
          const markerInfo = CATEGORY_MARKERS[categoryKey] || CATEGORY_MARKERS.restaurant;

          const imageSize = new window.kakao.maps.Size(34, 34);
          const imageOption = { offset: new window.kakao.maps.Point(20, 34) };

          // 커스텀 이미지 객체 생성
          markerImage = new window.kakao.maps.MarkerImage(markerInfo.url, imageSize, imageOption);
        }

        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);

        // 마커 생성 시 image가 null이면 Kakao Maps 기본 핀이 사용됩니다.
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: mapInstance,
          title: place.name,
          image: markerImage, // mode='senior'일 경우 null이므로 기본 핀 사용
        });

        markersRef.current.push(marker);
        bounds.extend(position);
      }
    });

    if (markersRef.current.length > 0) {
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, places, mode]); // ✅ mode가 바뀔 때도 재실행되도록 의존성 추가

  // 3. 지도 자동 확대/이동 로직
  useEffect(() => {
    if (!mapInstance || !selectedPlace || !selectedPlace.latitude || !selectedPlace.longitude) {
      return;
    }

    const position = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);

    mapInstance.setCenter(position);
    mapInstance.setLevel(2);
  }, [mapInstance, selectedPlace]);

  return <div ref={mapRef} className="w-full h-full" />;
}
