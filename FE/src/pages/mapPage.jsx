'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

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

  // 위치 관련 상태
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState(false);

  // 상세조건 패널 제어
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // ⭐ 상세조건 패널의 선택값을 기억하는 상태
  const [panelFilters, setPanelFilters] = useState(null);

  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);

  const handleMapReady = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  // 장소 선택 시 지도 중심 이동
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

  // 내 위치 기능
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

  // ⭐ 필터링 로직 (완전판)
  const filteredPlaces = useMemo(() => {
    let places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

    // 1. 지역 필터 (시도/시군구)
    if (sido) {
      const targetRegionCodes = REGIONS.filter(
        (r) => r.province === sido && (!sigungu || r.district === sigungu)
      ).map((r) => r.region_code);

      places = places.filter((place) => {
        // region_code 없는 데이터도 일단 보여줌 (엄격 적용 시 return false)
        if (!place.region_code) return true;
        return targetRegionCodes.includes(Number(place.region_code));
      });
    }

    // 2. 검색어 필터
    if (searchQuery) {
      places = places.filter((place) => place.name.includes(searchQuery));
    }

    // 3. 아동 급식카드 카테고리
    if (mode === 'child' && selectedFilters.length > 0) {
      places = places.filter((place) => selectedFilters.includes(place.category));
    }

    // 4. 영업중 / 배달가능
    if (showOpenOnly) places = places.filter((place) => place.isOpen);
    if (mode === 'child' && showDeliveryOnly) places = places.filter((place) => place.delivery);

    // 5. ⭐ 상세조건 패널 필터
    if (panelFilters) {
      const { targets, days, times, region } = panelFilters;

      // (1) 급식 대상 (AND 조건: 선택한 모든 대상을 포함해야 함)
      if (targets.length > 0) {
        places = places.filter((place) => {
          const rawTarget = place.targets || place.target_name;
          const placeTargets = Array.isArray(rawTarget) ? rawTarget : rawTarget ? [rawTarget] : [];

          return targets.every((filterTarget) =>
            placeTargets.some((t) => t.includes(filterTarget))
          );
        });
      }

      // (2) 요일 (OR 조건)
      if (days.length > 0) {
        places = places.filter((place) => days.every((d) => place.meal_days?.includes(d)));
      }

      // (3) 시간 (OR 조건)
      if (times.length > 0) {
        places = places.filter((place) => times.every((t) => place.meal_time?.includes(t)));
      }

      // (4) ⭐ 지역 범위 (전국 / 지역한정)
      // region이 null이면 필터링하지 않음 (전체 보기)
      if (region) {
        const targetValue = region === 'nationwide' ? '전국' : '지역한정';

        places = places.filter((place) => {
          // target 데이터가 있는 경우에만 비교 (노인 급식소 등)
          if (place.target) {
            return place.target === targetValue;
          }
          return true; // target 정보가 없으면 통과
        });
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

  // 모드 변경 시 초기화
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setSelectedPlace(null);
    setShowOpenOnly(false);
    setShowDeliveryOnly(false);
    setPanelFilters(null); // 필터 초기화
    setIsFilterOpen(false);
    setIsLocationFocused(false);
  };

  const handlePanelApply = (filters) => {
    setPanelFilters(filters);
    setIsFilterOpen(false);
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
          onOpenFilter={() => setIsFilterOpen(true)}
          onOpenRegionSelect={() => setIsRegionSelectOpen(true)}
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
            <div className="absolute top-0 left-0 h-full z-50 p-4 pointer-events-none">
              <div className="pointer-events-auto h-full" style={{ marginLeft: '380px' }}>
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
