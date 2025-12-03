'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';
import SideActionButtons from '../components/common/map/SideActionButtons';

import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';

export default function MapPage() {
  const [mode, setMode] = useState('child');
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDeliveryOnly, setShowDeliveryOnly] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);

  const handleMapReady = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  // selectedPlace가 변경될 때 지도 중심 이동
  useEffect(() => {
    if (selectedPlace && mapRef.current && !isLocationFocused) {
      const kakaoLatLng = new window.kakao.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude
      );

      setTimeout(() => {
        mapRef.current.setCenter(kakaoLatLng);
        mapRef.current.setLevel(3);
      }, 100);
    }
  }, [selectedPlace, isLocationFocused]);

  const handleMyLocation = () => {
    if (isLocationFocused) {
      // 이미 내 위치로 포커스되어 있으면 전체 지도로 리셋
      setIsLocationFocused(false);
      mapRef.current.setLevel(10); // 전체 지도 보기
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('이 브라우저는 위치 기능을 지원하지 않습니다.');
      return;
    }

    if (!mapRef.current) {
      setLocationError('지도가 로드되지 않았습니다.');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const kakaoLatLng = new window.kakao.maps.LatLng(latitude, longitude);

        setTimeout(() => {
          mapRef.current.setCenter(kakaoLatLng);
          mapRef.current.setLevel(3);
        }, 100);

        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setMap(null);
        }

        // 커스텀 마커 (파란색 원 느낌)
        const markerImage = new window.kakao.maps.MarkerImage(
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%234A90E2" stroke="white" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="white"/></svg>',
          new window.kakao.maps.Size(40, 40),
          { offset: new window.kakao.maps.Point(20, 20) }
        );

        const marker = new window.kakao.maps.Marker({
          position: kakaoLatLng,
          map: mapRef.current,
          image: markerImage,
          title: '현재 위치',
        });

        currentLocationMarkerRef.current = marker;
        setIsLoadingLocation(false);
        setIsLocationFocused(true);
      },
      (error) => {
        console.error('Geolocation error:', error);

        let errorMessage = '위치를 가져올 수 없습니다.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 접근 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = '위치 정보를 사용할 수 없습니다.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = '위치 요청 시간이 초과되었습니다.';
        }

        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      }
    );
  };

  const filteredPlaces = useMemo(() => {
    const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;
    return places.filter((place) => {
      if (searchQuery && !place.name.includes(searchQuery)) return false;
      if (
        mode === 'child' &&
        selectedFilters.length > 0 &&
        !selectedFilters.includes(place.category)
      )
        return false;
      if (sido) {
        const targetRegionCodes = REGIONS.filter(
          (r) => r.province === sido && (!sigungu || r.district === sigungu)
        ).map((r) => r.region_code);
        if (!place.region_code || !targetRegionCodes.includes(Number(place.region_code)))
          return false;
      }
      if (showOpenOnly && !place.isOpen) return false;
      if (mode === 'child' && showDeliveryOnly && !place.delivery) return false;
      return true;
    });
  }, [mode, searchQuery, selectedFilters, sido, sigungu, showOpenOnly, showDeliveryOnly]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setSelectedPlace(null);
    setShowOpenOnly(false);
    setShowDeliveryOnly(false);
    setIsLocationFocused(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <CategoryToggle mode={mode} onModeChange={handleModeChange} />
      <div className="flex w-full h-full relative">
        <Sidebar
          mode={mode}
          sido={sido}
          setSido={setSido}
          sigungu={sigungu}
          setSigungu={setSigungu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filteredPlaces={filteredPlaces}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          showOpenOnly={showOpenOnly}
          setShowOpenOnly={setShowOpenOnly}
          showDeliveryOnly={showDeliveryOnly}
          setShowDeliveryOnly={setShowDeliveryOnly}
        />
        <div className="relative w-full h-full">
          <div className="absolute left-6 top-6 z-40">
            <SideActionButtons
              onMyLocation={handleMyLocation}
              isLoadingLocation={isLoadingLocation}
              locationError={locationError}
              isLocationFocused={isLocationFocused}
            />
          </div>
          <MapContainer
            mode={mode}
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onMapReady={handleMapReady}
          />
        </div>
      </div>
    </div>
  );
}
