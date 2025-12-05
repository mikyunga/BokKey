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

  // ⭐ 변경점 1: 마커를 배열이 아닌 Map 객체로 관리 (ID로 마커를 찾기 위해)
  const markersMapRef = useRef(new Map());

  const { isFavorite } = useFavorites();

  // 1. 지도 생성 (기존과 동일)
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

  // 2. 마커 스마트 업데이트 (⭐ 핵심 로직 변경)
  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    const currentPlaceIds = new Set();
    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      currentPlaceIds.add(place.id); // 현재 데이터에 존재하는 ID 기록
      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      bounds.extend(position);

      // --- 이미지 결정 로직 ---
      let iconUrl = null;
      if (isFavorite(place.id, mode)) {
        iconUrl = IconYellow;
      } else if (mode === 'child') {
        const categoryData = CATEGORY_MARKERS[place.category] || CATEGORY_MARKERS.restaurant;
        iconUrl = categoryData.url;
      } else {
        iconUrl = IconYellow; // 노인 급식소 기본값
      }

      const imageSize = new window.kakao.maps.Size(34, 34);
      const imageOption = { offset: new window.kakao.maps.Point(17, 34) };
      const markerImage = new window.kakao.maps.MarkerImage(iconUrl, imageSize, imageOption);
      // ----------------------

      // ⭐ "이미 마커가 있니?" 확인
      if (markersMapRef.current.has(place.id)) {
        // [A] 있으면: 이미지만 교체 (깜빡임 없음!)
        const existingMarker = markersMapRef.current.get(place.id);
        existingMarker.setImage(markerImage);
        // 위치가 미세하게 바뀔 수도 있으니 위치 업데이트 (필요 시)
        existingMarker.setPosition(position);
      } else {
        // [B] 없으면: 새로 생성
        const newMarker = new window.kakao.maps.Marker({
          position,
          map: mapInstance,
          title: place.name,
          image: markerImage,
        });
        markersMapRef.current.set(place.id, newMarker);
      }
    });

    // ⭐ 3. 더 이상 목록에 없는 마커 삭제 (필터링 등으로 사라진 애들만 지움)
    markersMapRef.current.forEach((marker, id) => {
      if (!currentPlaceIds.has(id)) {
        marker.setMap(null); // 지도에서 제거
        markersMapRef.current.delete(id); // Map에서 제거
      }
    });

    // 마커가 처음 로딩되거나 검색 등으로 리스트가 확 바뀐 경우에만 범위 재설정
    // (이 조건은 UX에 따라 조정 가능하지만, 보통 리스트가 바뀌면 범위도 맞추는 게 좋습니다)
    if (places.length > 0 && !selectedPlace) {
      // 너무 빈번한 이동을 막으려면 이 부분을 조건부로 처리할 수도 있습니다.
      // mapInstance.setBounds(bounds);
    }
  }, [mapInstance, places, mode, isFavorite, selectedPlace]);

  // 3. 선택된 장소로 이동 (기존과 동일)
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
