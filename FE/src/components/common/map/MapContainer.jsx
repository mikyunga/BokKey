'use client';

import { useEffect, useRef, useState } from 'react';
import { useFavorites } from '../../../contexts/FavoriteContext';
import {
  IconBlue,
  IconGreen,
  IconOrange,
  IconPurple,
  IconRed,
  IconSkyblue,
  IconYellow,
} from '../../../utils/icons';

const CATEGORY_MARKERS = {
  restaurant: { url: IconRed },
  convenience: { url: IconOrange },
  fastfood: { url: IconGreen },
  cafe: { url: IconSkyblue },
  bakery: { url: IconBlue },
  mart: { url: IconPurple },
};

export default function MapContainer({ mode, places, selectedPlace, onMapReady }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersMapRef = useRef(new Map()); // Map으로 마커 관리

  const { isFavorite } = useFavorites();

  // 1. 지도 생성 (기존 유지)
  useEffect(() => {
    if (mapInstance) return;
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      const container = mapRef.current;
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
  }, [onMapReady, mapInstance]);

  // 2. 마커 업데이트
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    const currentPlaceIds = new Set();
    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      currentPlaceIds.add(place.id);
      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      bounds.extend(position);

      // ⭐ [수정됨] 마커 이미지 결정 로직
      let markerImage = null; // 기본값은 null (카카오맵 기본 핀)

      // (1) 즐겨찾기면 -> 무조건 노란색 별
      if (isFavorite(place.id, mode)) {
        const imageSize = new window.kakao.maps.Size(34, 34);
        const imageOption = { offset: new window.kakao.maps.Point(17, 34) };
        markerImage = new window.kakao.maps.MarkerImage(IconYellow, imageSize, imageOption);
      }
      // (2) 즐겨찾기가 아니고, 아동 모드면 -> 카테고리 아이콘
      else if (mode === 'child') {
        const categoryData = CATEGORY_MARKERS[place.category] || CATEGORY_MARKERS.restaurant;
        const imageSize = new window.kakao.maps.Size(34, 34);
        const imageOption = { offset: new window.kakao.maps.Point(17, 34) };
        markerImage = new window.kakao.maps.MarkerImage(categoryData.url, imageSize, imageOption);
      }
      // (3) 그 외(노인 모드이고 즐겨찾기가 아님) -> markerImage는 null 유지 (기본 핀 사용)

      // 마커 생성 또는 업데이트
      if (markersMapRef.current.has(place.id)) {
        // 이미 있으면 이미지만 교체
        const existingMarker = markersMapRef.current.get(place.id);
        existingMarker.setImage(markerImage); // null이면 기본 핀으로 돌아갑니다
        existingMarker.setPosition(position);
      } else {
        // 없으면 새로 생성
        const newMarker = new window.kakao.maps.Marker({
          position,
          map: mapInstance,
          title: place.name,
          image: markerImage,
        });
        markersMapRef.current.set(place.id, newMarker);
      }
    });

    // 화면에 없는 마커 제거
    markersMapRef.current.forEach((marker, id) => {
      if (!currentPlaceIds.has(id)) {
        marker.setMap(null);
        markersMapRef.current.delete(id);
      }
    });

    // 리스트 초기 진입 시 등 필요할 때만 바운드 조정 (선택사항)
    // if (places.length > 0 && !selectedPlace) {
    //   mapInstance.setBounds(bounds);
    // }
  }, [mapInstance, places, mode, isFavorite, selectedPlace]);

  // 3. 지도 이동 로직 (기존 유지)
  useEffect(() => {
    if (!mapInstance || !selectedPlace?.latitude || !selectedPlace?.longitude) return;
    const pos = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
    const timer = setTimeout(() => {
      mapInstance.panTo(pos);
    }, 50);
    return () => clearTimeout(timer);
  }, [mapInstance, selectedPlace]);

  return (
    <div ref={mapRef} className="w-full h-full z-0" style={{ position: 'absolute', inset: 0 }} />
  );
}
