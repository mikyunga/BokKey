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

export default function MapContainer({ mode, places, selectedPlace }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersRef = useRef([]);

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

  useEffect(() => {
    if (!mapInstance || !places || typeof window.kakao === 'undefined') return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      let markerImage = null;
      if (mode === 'child') {
        const category = CATEGORY_MARKERS[place.category] || CATEGORY_MARKERS.restaurant;
        const imageSize = new window.kakao.maps.Size(34, 34);
        const imageOption = { offset: new window.kakao.maps.Point(20, 34) };
        markerImage = new window.kakao.maps.MarkerImage(category.url, imageSize, imageOption);
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

    if (markersRef.current.length > 0) mapInstance.setBounds(bounds);
  }, [mapInstance, places, mode]);

  useEffect(() => {
    if (!mapInstance || !selectedPlace?.latitude || !selectedPlace?.longitude) return;
    const pos = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
    mapInstance.setCenter(pos);
    mapInstance.setLevel(2);
  }, [mapInstance, selectedPlace]);

  return (
    <div ref={mapRef} className="w-full h-full z-0" style={{ position: 'absolute', inset: 0 }} />
  );
}
