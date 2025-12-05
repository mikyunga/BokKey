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
}) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersMapRef = useRef(new Map());

  const prevPlaceIdsRef = useRef('');
  // prevSelectedPlaceRef는 더 이상 트리거로 쓰지 않지만 로직 유지를 위해 남겨둘 수 있습니다.
  const prevSelectedPlaceRef = useRef(null);
  const prevLocationFocusedRef = useRef(false);

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

  // 2. 마커 업데이트 및 "자동 범위 조정(SetBounds)" 로직
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    const bounds = new window.kakao.maps.LatLngBounds();
    const currentPlaceIds = [];

    // --- (A) 마커 그리기 로직 ---
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

    // --- (B) ⭐ 핵심 수정: 언제 지도를 전체 뷰로 맞출 것인가? ---

    const currentIdsString = currentPlaceIds.sort().join(',');

    // 1. 리스트 구성이 바뀌었을 때 (필터, 검색 등) -> 전체 보기 O
    const isListChanged = prevPlaceIdsRef.current !== currentIdsString;

    // 2. [삭제됨] 방금 선택을 취소했을 때 -> 전체 보기 X (그대로 유지)
    // const isJustDeselected = prevSelectedPlaceRef.current !== null && selectedPlace === null;

    // 3. 방금 내 위치를 껐을 때 -> 전체 보기 O
    const isLocationJustTurnedOff =
      prevLocationFocusedRef.current === true && isLocationFocused === false;

    // 조건: 마커가 있고 + (현재 특정 장소 선택 중이 아님) + (리스트가 바뀌었거나 OR 내 위치가 꺼졌을 때만!)
    // ❌ isJustDeselected 조건은 뺐습니다!
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
  }, [mapInstance, places, mode, isFavorite, selectedPlace, isLocationFocused]);

  // 3. 선택된 장소로 이동 (기존 유지)
  useEffect(() => {
    if (!mapInstance || !selectedPlace) return;

    const lat = parseFloat(selectedPlace.latitude);
    const lng = parseFloat(selectedPlace.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const pos = new window.kakao.maps.LatLng(lat, lng);

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
