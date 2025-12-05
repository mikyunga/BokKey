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
  const markersMapRef = useRef(new Map());
  const prevPlaceIdsRef = useRef('');

  const { isFavorite } = useFavorites();

  // 1. 지도 생성
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

  // 2. 마커 표시 및 필터링 로직
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    const bounds = new window.kakao.maps.LatLngBounds();
    const currentPlaceIds = [];

    places.forEach((place) => {
      // ⭐ 데이터 방어 코드: 좌표 없으면 아예 무시
      if (!place.latitude || !place.longitude) return;

      const lat = parseFloat(place.latitude);
      const lng = parseFloat(place.longitude);

      // ⭐ NaN 체크: 숫자가 아니면 무시
      if (isNaN(lat) || isNaN(lng)) return;

      currentPlaceIds.push(place.id);
      const position = new window.kakao.maps.LatLng(lat, lng);
      bounds.extend(position);

      // 마커 이미지 결정
      let markerImage = null;
      if (isFavorite(place.id, mode)) {
        const imageSize = new window.kakao.maps.Size(34, 34);
        const imageOption = { offset: new window.kakao.maps.Point(17, 34) };
        markerImage = new window.kakao.maps.MarkerImage(IconYellow, imageSize, imageOption);
      } else if (mode === 'child') {
        const categoryData = CATEGORY_MARKERS[place.category] || CATEGORY_MARKERS.restaurant;
        const imageSize = new window.kakao.maps.Size(34, 34);
        const imageOption = { offset: new window.kakao.maps.Point(17, 34) };
        markerImage = new window.kakao.maps.MarkerImage(categoryData.url, imageSize, imageOption);
      }

      // 마커 생성/업데이트
      if (markersMapRef.current.has(place.id)) {
        const existingMarker = markersMapRef.current.get(place.id);
        existingMarker.setImage(markerImage);
        existingMarker.setPosition(position);
      } else {
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
    const currentIdSet = new Set(currentPlaceIds);
    markersMapRef.current.forEach((marker, id) => {
      if (!currentIdSet.has(id)) {
        marker.setMap(null);
        markersMapRef.current.delete(id);
      }
    });

    // 지도 범위 자동 조정 (리스트가 바뀌었을 때만)
    const currentIdsString = currentPlaceIds.sort().join(',');
    const isListChanged = prevPlaceIdsRef.current !== currentIdsString;
    const hasMarkers = currentPlaceIds.length > 0;
    const isNotSelectingSpecificPlace = !selectedPlace;

    if (hasMarkers && isListChanged && isNotSelectingSpecificPlace) {
      mapInstance.setBounds(bounds);
    }

    prevPlaceIdsRef.current = currentIdsString;
  }, [mapInstance, places, mode, isFavorite, selectedPlace]);

  // 3. ⭐ [핵심 수정] 선택된 장소로 이동 및 확대 (강력한 방어 코드)
  useEffect(() => {
    // (1) 데이터가 없으면 즉시 종료
    if (!mapInstance || !selectedPlace) return;

    // (2) 좌표를 실수(float)로 변환
    const lat = parseFloat(selectedPlace.latitude);
    const lng = parseFloat(selectedPlace.longitude);

    // (3) ⭐ 좌표가 이상하면(NaN) 절대 이동하지 않음 (콘솔로 확인 가능)
    if (isNaN(lat) || isNaN(lng)) {
      console.error('❌ 잘못된 좌표 감지됨:', selectedPlace);
      return;
    }

    const pos = new window.kakao.maps.LatLng(lat, lng);

    // (4) panTo 대신 setCenter 사용 (확실하게 이동시키기 위해)
    // 약간의 딜레이를 주어 렌더링 충돌 방지
    const timer = setTimeout(() => {
      // 지도 중심을 강제로 해당 위치로 똽! 찍어버림 (튀는 현상 방지)
      mapInstance.setCenter(pos);

      // 그 후 레벨 확인해서 확대
      if (mapInstance.getLevel() > 3) {
        mapInstance.setLevel(3, { animate: true });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [mapInstance, selectedPlace]);

  return (
    <div ref={mapRef} className="w-full h-full z-0" style={{ position: 'absolute', inset: 0 }} />
  );
}
