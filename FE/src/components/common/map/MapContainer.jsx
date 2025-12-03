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

const CATEGORY_MARKERS = {
  restaurant: { url: IconRed },
  convenience: { url: IconOrange },
  fastfood: { url: IconGreen },
  cafe: { url: IconSkyblue },
  bakery: { url: IconBlue },
  mart: { url: IconPurple },
  welfare: { url: '/images/markers/grey_pin.png' },
};

export default function MapContainer({ mode, places, selectedPlace, onMapReady }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersRef = useRef([]);

  // 1. 지도 생성 (최초 1회만)
  useEffect(() => {
    // ⭐ [최적화] 이미 지도가 있다면 새로 만들지 않음!
    if (mapInstance) return;

    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      const container = mapRef.current;

      // 안전장치: 컨테이너 초기화
      if (container.hasChildNodes()) {
        container.innerHTML = '';
      }

      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      setMapInstance(map);

      if (onMapReady) {
        onMapReady(map);
      }
    }
  }, [onMapReady, mapInstance]); // mapInstance가 있으면 실행되지 않음

  // 2. 마커 업데이트 (데이터 변경 시 실행)
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    // 기존 마커 삭제
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 데이터가 없으면 여기서 종료
    if (places.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      let markerImage = null;
      if (mode === 'child') {
        const category = CATEGORY_MARKERS[place.category] || CATEGORY_MARKERS.restaurant;
        // 이미지가 유효한 경우에만 생성
        if (category && category.url) {
          const imageSize = new window.kakao.maps.Size(34, 34);
          const imageOption = { offset: new window.kakao.maps.Point(17, 34) };
          markerImage = new window.kakao.maps.MarkerImage(category.url, imageSize, imageOption);
        }
      }

      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance,
        title: place.name,
        image: markerImage,
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // 마커가 있을 때만 지도 범위 재설정
    if (markersRef.current.length > 0) {
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, places, mode]);

  // 3. 선택된 장소로 이동
  useEffect(() => {
    if (!mapInstance || !selectedPlace?.latitude || !selectedPlace?.longitude) return;

    const pos = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);

    // 약간의 딜레이를 주어 부드러운 이동 처리
    const timer = setTimeout(() => {
      mapInstance.panTo(pos);
      // 필요 시 레벨 조정
      // mapInstance.setLevel(3);
    }, 50);

    return () => clearTimeout(timer);
  }, [mapInstance, selectedPlace]);

  return (
    <div ref={mapRef} className="w-full h-full z-0" style={{ position: 'absolute', inset: 0 }} />
  );
}
