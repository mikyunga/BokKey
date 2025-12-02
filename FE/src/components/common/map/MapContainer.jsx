'use client';

import { useEffect, useRef, useState } from 'react';

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
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);

        const marker = new window.kakao.maps.Marker({
          position: position,
          map: mapInstance,
          title: place.name,
        });

        markersRef.current.push(marker);
        bounds.extend(position);
      }
    });

    if (markersRef.current.length > 0) {
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, places]);

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
