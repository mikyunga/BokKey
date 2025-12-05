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

// ⭐ isLocationFocused prop을 받도록 추가
export default function MapContainer({
  mode,
  places,
  selectedPlace,
  onMapReady,
  isLocationFocused,
}) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersMapRef = useRef(new Map());

  // 상태 변화 감지용 Ref들
  const prevPlaceIdsRef = useRef('');
  const prevSelectedPlaceRef = useRef(null); // ⭐ 이전 선택 장소 기억
  const prevLocationFocusedRef = useRef(false); // ⭐ 이전 내 위치 상태 기억

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

  // 2. 마커 업데이트 및 "자동 범위 조정(SetBounds)" 로직
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    const bounds = new window.kakao.maps.LatLngBounds();
    const currentPlaceIds = [];

    // --- (A) 마커 그리기 로직 (기존과 동일) ---
    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;
      const lat = parseFloat(place.latitude);
      const lng = parseFloat(place.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      currentPlaceIds.push(place.id);
      const position = new window.kakao.maps.LatLng(lat, lng);
      bounds.extend(position);

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

    const currentIdSet = new Set(currentPlaceIds);
    markersMapRef.current.forEach((marker, id) => {
      if (!currentIdSet.has(id)) {
        marker.setMap(null);
        markersMapRef.current.delete(id);
      }
    });

    // --- (B) ⭐ 핵심: 언제 지도를 전체 뷰로 맞출 것인가? ---

    const currentIdsString = currentPlaceIds.sort().join(',');

    // 1. 리스트 구성이 바뀌었을 때 (필터, 검색 등)
    const isListChanged = prevPlaceIdsRef.current !== currentIdsString;

    // 2. 방금 선택을 취소했을 때 (SelectedPlace: 있음 -> 없음)
    const isJustDeselected = prevSelectedPlaceRef.current !== null && selectedPlace === null;

    // 3. 방금 내 위치를 껐을 때 (LocationFocused: 켜짐 -> 꺼짐)
    const isLocationJustTurnedOff =
      prevLocationFocusedRef.current === true && isLocationFocused === false;

    // 조건: 마커가 있고 + (현재 특정 장소 선택 중이 아님) + (위 3가지 트리거 중 하나 발생)
    if (
      currentPlaceIds.length > 0 &&
      !selectedPlace &&
      (isListChanged || isJustDeselected || isLocationJustTurnedOff)
    ) {
      mapInstance.setBounds(bounds);
    }

    // --- (C) 상태 업데이트 (다음 비교를 위해) ---
    prevPlaceIdsRef.current = currentIdsString;
    prevSelectedPlaceRef.current = selectedPlace;
    prevLocationFocusedRef.current = isLocationFocused;
  }, [mapInstance, places, mode, isFavorite, selectedPlace, isLocationFocused]); // ⭐ 의존성 추가됨

  // 3. 선택된 장소로 이동 (기존 유지)
  useEffect(() => {
    if (!mapInstance || !selectedPlace) return;

    const lat = parseFloat(selectedPlace.latitude);
    const lng = parseFloat(selectedPlace.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error('❌ 잘못된 좌표:', selectedPlace);
      return;
    }

    const pos = new window.kakao.maps.LatLng(lat, lng);

    // 드래그 중이거나 다른 동작과 겹치지 않게 딜레이
    const timer = setTimeout(() => {
      mapInstance.setCenter(pos);
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
