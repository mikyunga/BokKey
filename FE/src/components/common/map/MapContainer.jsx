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
  const customOverlayRef = useRef(null); // ⭐ 말풍선 Overlay

  const prevPlaceIdsRef = useRef('');
  const prevSelectedPlaceRef = useRef(null);
  const prevLocationFocusedRef = useRef(false);
  const prevModeRef = useRef(mode);

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

  // ⭐ 모드가 바뀌면 모든 마커 제거
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      console.log('🔄 모드 변경 감지:', prevModeRef.current, '→', mode);
      console.log('🗑️ 모든 마커 제거 중... (총', markersMapRef.current.size, '개)');

      markersMapRef.current.forEach((marker, id) => {
        marker.setMap(null);
      });
      markersMapRef.current.clear();

      // ⭐ 말풍선도 제거
      if (customOverlayRef.current) {
        customOverlayRef.current.setMap(null);
        customOverlayRef.current = null;
      }

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

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;
      const lat = parseFloat(place.latitude);
      const lng = parseFloat(place.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      currentPlaceIds.push(place.id);
      const position = new window.kakao.maps.LatLng(lat, lng);
      bounds.extend(position);

      // ⭐⭐⭐ 선택된 장소인지 확인
      const isSelected = selectedPlace && selectedPlace.id === place.id;

      // ⭐ 마커 크기 결정 (선택되면 크게)
      const markerSize = isSelected
        ? new window.kakao.maps.Size(48, 48)
        : new window.kakao.maps.Size(34, 34);

      const markerOffset = isSelected
        ? new window.kakao.maps.Point(24, 48)
        : new window.kakao.maps.Point(17, 34);

      // 마커 이미지 결정
      let markerImage = null;
      if (isFavorite(place.id, mode)) {
        markerImage = new window.kakao.maps.MarkerImage(IconYellow, markerSize, {
          offset: markerOffset,
        });
      } else if (mode === 'child') {
        const categoryData = CATEGORY_MARKERS[place.category] || CATEGORY_MARKERS.restaurant;
        markerImage = new window.kakao.maps.MarkerImage(categoryData.url, markerSize, {
          offset: markerOffset,
        });
      } else {
        // senior 모드일 때 기본 마커 (빨간색)
        markerImage = new window.kakao.maps.MarkerImage(IconRed, markerSize, {
          offset: markerOffset,
        });
      }

      // 기존 마커가 있으면 업데이트, 없으면 생성
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
          clickable: true,
        });

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

    const currentIdsString = currentPlaceIds.sort().join(',');
    const isListChanged = prevPlaceIdsRef.current !== currentIdsString;
    const isLocationJustTurnedOff =
      prevLocationFocusedRef.current === true && isLocationFocused === false;

    if (
      currentPlaceIds.length > 0 &&
      !selectedPlace &&
      (isListChanged || isLocationJustTurnedOff)
    ) {
      mapInstance.setBounds(bounds);
    }

    prevPlaceIdsRef.current = currentIdsString;
    prevSelectedPlaceRef.current = selectedPlace;
    prevLocationFocusedRef.current = isLocationFocused;
  }, [mapInstance, places, mode, isFavorite, selectedPlace, isLocationFocused, onSelectPlace]);

  // ⭐⭐⭐ 3. 선택된 장소에 말풍선 표시
  useEffect(() => {
    if (!mapInstance || !selectedPlace || typeof window.kakao === 'undefined') return;

    const lat = parseFloat(selectedPlace.latitude);
    const lng = parseFloat(selectedPlace.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 기존 말풍선 제거
    if (customOverlayRef.current) {
      customOverlayRef.current.setMap(null);
    }

    // ⭐ 말풍선 HTML 생성
    const content = document.createElement('div');
    content.style.cssText = `
      position: relative;
      bottom: 60px;
      background: white;
      padding: 4px 8px;
      border-radius: 5px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      font-size: 12px;
      font-weight: 600;
      color: black;
      white-space: nowrap;
      border: 1px solid rgba(0,0,0,0.3);
      overflow: visible;
    `;
    // 말풍선 꼬리 추가 (가로만 얇게 - 회전 고려)
    const tail = document.createElement('div');
    tail.style.cssText = `
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 6px;
    height: 6px;
    background: white;
    border-right: 1px solid rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(0,0,0,0.3);
`;

    content.textContent = selectedPlace.name;
    content.appendChild(tail);

    // CustomOverlay 생성
    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: content,
      yAnchor: 1,
    });

    customOverlay.setMap(mapInstance);
    customOverlayRef.current = customOverlay;

    // 지도 중심 이동
    const timer = setTimeout(() => {
      mapInstance.setCenter(position);
      if (mapInstance.getLevel() > 3) {
        mapInstance.setLevel(3, { animate: true });
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (customOverlayRef.current) {
        customOverlayRef.current.setMap(null);
        customOverlayRef.current = null;
      }
    };
  }, [mapInstance, selectedPlace]);

  return (
    <div ref={mapRef} className="w-full h-full z-0" style={{ position: 'absolute', inset: 0 }} />
  );
}
