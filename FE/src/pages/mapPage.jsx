'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';
import SideActionButtons from '../components/common/map/SideActionButtons';
import FilterPanel from '../components/common/map/FilterPanel';

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [panelFilters, setPanelFilters] = useState({
    targets: [],
    days: [],
    times: [],
    region: null,
  });

  const [panelTop, setPanelTop] = useState(0);

  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);

  const handleMapReady = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
  }, []);

  // 지도 중심 이동
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

  // 내 위치 버튼
  const handleMyLocation = () => {
    if (isLocationFocused) {
      setIsLocationFocused(false);
      mapRef.current.setLevel(10);
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
      () => {
        setLocationError('위치를 가져올 수 없습니다.');
        setIsLoadingLocation(false);
      }
    );
  };

  /** -------------------------------
   * ⭐ 필터링 전체 로직
   * ------------------------------ */
  const filteredPlaces = useMemo(() => {
    let places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

    if (sido) {
      const validCodes = REGIONS.filter(
        (r) => r.province === sido && (!sigungu || r.district === sigungu)
      ).map((r) => r.region_code);

      places = places.filter((p) =>
        p.region_code ? validCodes.includes(Number(p.region_code)) : true
      );
    }

    if (searchQuery) {
      places = places.filter((p) => p.name.includes(searchQuery));
    }

    if (mode === 'child' && selectedFilters.length > 0) {
      places = places.filter((p) => selectedFilters.includes(p.category));
    }

    if (showOpenOnly) places = places.filter((p) => p.isOpen);
    if (mode === 'child' && showDeliveryOnly) places = places.filter((p) => p.delivery);

    /** 상세조건 패널 필터 */
    if (panelFilters) {
      const { targets, days, times, region } = panelFilters;

      if (targets.length > 0) {
        places = places.filter((place) => {
          const rawTarget = place.targets || place.target_name;
          const arr = Array.isArray(rawTarget) ? rawTarget : rawTarget ? [rawTarget] : [];
          return targets.every((t) => arr.some((pt) => pt.includes(t)));
        });
      }

      if (days.length > 0) {
        places = places.filter((p) => days.every((d) => p.meal_days?.includes(d)));
      }

      if (times.length > 0) {
        places = places.filter((p) => times.every((t) => p.meal_time?.includes(t)));
      }

      if (region) {
        const value = region === 'nationwide' ? '전국' : '지역한정';
        places = places.filter((p) => p.target === value);
      }
    }

    return places;
  }, [
    mode,
    sido,
    sigungu,
    searchQuery,
    selectedFilters,
    showOpenOnly,
    showDeliveryOnly,
    panelFilters,
  ]);

  /** -------------------------------
   * 상세조건 패널 제어
   * ------------------------------ */
  const handlePanelApply = (filters) => {
    setPanelFilters(filters);

    const nothingSelected =
      filters.targets.length === 0 &&
      filters.days.length === 0 &&
      filters.times.length === 0 &&
      (filters.region === null || filters.region === 'nationwide');

    // 상세조건 버튼 inactive
    if (nothingSelected && panelFilters.resetActive) {
      panelFilters.resetActive();
    }

    setIsFilterOpen(false);
  };

  // PlaceList → MapPage로 전달되는 정보
  const handleOpenFilter = (pos) => {
    if (pos?.top) setPanelTop(pos.top);
    if (pos?.resetActive) {
      setPanelFilters((prev) => ({
        ...prev,
        resetActive: pos.resetActive,
      }));
    }
    setIsFilterOpen(true);
  };

  /** -------------------------------
   * RESET 전용 로직
   * ------------------------------ */
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setSelectedPlace(null);
    setShowOpenOnly(false);
    setShowDeliveryOnly(false);
    setPanelFilters({
      targets: [],
      days: [],
      times: [],
      region: null,
    });
    setIsFilterOpen(false);
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
          onOpenFilter={handleOpenFilter}
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

          {isFilterOpen && (
            <div
              className="absolute left-0 z-50 p-2 pointer-events-none flex flex-col justify-start"
              style={{
                top: `${Math.max(0, panelTop - 24)}px`,
                height: `calc(100% - ${Math.max(0, panelTop - 30)}px)`,
              }}
            >
              <div className="pointer-events-auto h-full">
                <FilterPanel
                  initialFilters={panelFilters}
                  onApply={handlePanelApply}
                  onCancel={() => setIsFilterOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
