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

export default function MapContainer({
  mode,
  places,
  selectedPlace,
  onMapReady,
  isLocationFocused,
  onSelectPlace,
}) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersMapRef = useRef(new Map());

  const prevPlaceIdsRef = useRef('');
  const prevSelectedPlaceRef = useRef(null);
  const prevLocationFocusedRef = useRef(false);
  const prevModeRef = useRef(mode); // ⭐ 이전 모드 추적

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

  // ⭐⭐⭐ 모드가 바뀌면 모든 마커 제거
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      console.log('🔄 모드 변경 감지:', prevModeRef.current, '→', mode);
      console.log('🗑️ 모든 마커 제거 중... (총', markersMapRef.current.size, '개)');

      // 모든 마커를 지도에서 제거하고 Map 초기화
      markersMapRef.current.forEach((marker, id) => {
        marker.setMap(null);
      });
      markersMapRef.current.clear();

      console.log('✅ 마커 제거 완료');
      prevModeRef.current = mode;
    }
  }, [mode]);

  // 2. 마커 업데이트 및 이벤트 리스너 등록
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    const bounds = new window.kakao.maps.LatLngBounds();
    const currentPlaceIds = [];

    console.log('🎯 마커 업데이트 시작 - 현재 모드:', mode, '/ 장소 개수:', places.length);

    // --- (A) 마커 그리기 로직 ---
    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;
      const lat = parseFloat(place.latitude);
      const lng = parseFloat(place.longitude);
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

      // 기존 마커가 있으면 업데이트, 없으면 생성
      if (markersMapRef.current.has(place.id)) {
        const existingMarker = markersMapRef.current.get(place.id);
        existingMarker.setImage(markerImage);
        existingMarker.setPosition(position);
      } else {
        // ⭐ 새 마커 생성
        const newMarker = new window.kakao.maps.Marker({
          position,
          map: mapInstance,
          title: place.name,
          image: markerImage,
          clickable: true,
        });

        // ⭐⭐⭐ 클릭 이벤트 리스너 등록 (현재 place를 클로저로 캡처)
        window.kakao.maps.event.addListener(newMarker, 'click', () => {
          console.log('🖱️ 마커 클릭됨:', place.name, '/ ID:', place.id);
          if (onSelectPlace) {
            onSelectPlace(place);
          }
        });

        markersMapRef.current.set(place.id, newMarker);
        console.log('  ✅ 새 마커 생성:', place.name, '(ID:', place.id, ')');
      }
    });

    // 화면에 없는 마커 제거
    const currentIdSet = new Set(currentPlaceIds);
    markersMapRef.current.forEach((marker, id) => {
      if (!currentIdSet.has(id)) {
        console.log('  🗑️ 마커 제거:', id);
        marker.setMap(null);
        markersMapRef.current.delete(id);
      }
    });

    console.log('📍 최종 마커 개수:', markersMapRef.current.size);

    // --- (B) 지도 범위 재설정 로직 ---
    const currentIdsString = currentPlaceIds.sort().join(',');

    // 1. 리스트 구성이 바뀌었을 때 (필터, 검색 등)
    const isListChanged = prevPlaceIdsRef.current !== currentIdsString;

    // 2. 내 위치를 껐을 때
    const isLocationJustTurnedOff =
      prevLocationFocusedRef.current === true && isLocationFocused === false;

    // 조건: 마커가 있고 + (현재 선택된 장소가 없음) + (리스트가 바뀌었거나 OR 내 위치가 꺼졌을 때)
    if (
      currentPlaceIds.length > 0 &&
      !selectedPlace &&
      (isListChanged || isLocationJustTurnedOff)
    ) {
      mapInstance.setBounds(bounds);
    }

    // --- (C) 상태 업데이트 ---
    prevPlaceIdsRef.current = currentIdsString;
    prevSelectedPlaceRef.current = selectedPlace;
    prevLocationFocusedRef.current = isLocationFocused;
  }, [mapInstance, places, mode, isFavorite, selectedPlace, isLocationFocused, onSelectPlace]);

  // 3. 선택된 장소로 이동
  useEffect(() => {
    if (!mapInstance || !selectedPlace) return;

    const lat = parseFloat(selectedPlace.latitude);
    const lng = parseFloat(selectedPlace.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const pos = new window.kakao.maps.LatLng(lat, lng);

    const timer = setTimeout(() => {
      mapInstance.setCenter(pos);
      // 줌 레벨이 너무 넓으면(숫자가 크면) 조금 확대해줌
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
