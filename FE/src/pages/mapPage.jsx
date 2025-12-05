'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

// ... (나머지 import 동일) ...
import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';
import SideActionButtons from '../components/common/map/SideActionButtons';
import FilterPanel from '../components/common/map/FilterPanel';
import DetailPanel from '../components/common/map/DetailPanel';

import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';

export default function MapPage() {
  // ... (기존 state들 동일) ...
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
  const [detailFilterActive, setDetailFilterActive] = useState(false);

  const [isDetailCollapsed, setIsDetailCollapsed] = useState(false);

  const [copyToast, setCopyToast] = useState(false);

  const closeTimerRef = useRef(null);

  const toggleDetailCollapse = () => setIsDetailCollapsed((prev) => !prev);

  const closeDetailPanel = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setSelectedPlace(null);
      closeTimerRef.current = null;
    }, 250);
  };

  const handleCopySuccess = () => {
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

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

  useEffect(() => {
    if (selectedPlace && mapRef.current && !isLocationFocused) {
      const pos = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
      setTimeout(() => {
        mapRef.current.setCenter(pos);
        mapRef.current.setLevel(3);
      }, 120);
    }
  }, [selectedPlace, isLocationFocused]);

  const handleMyLocation = () => {
    // ... (내 위치 로직 동일) ...
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
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const kakaoLatLng = new window.kakao.maps.LatLng(latitude, longitude);

        mapRef.current.setCenter(kakaoLatLng);
        mapRef.current.setLevel(3);

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

  const filteredPlaces = useMemo(() => {
    // ... (필터 로직 동일) ...
    let places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

    if (sido) {
      const validCodes = REGIONS.filter(
        (r) => r.province === sido && (!sigungu || r.district === sigungu)
      ).map((r) => r.region_code);
      places = places.filter((p) => validCodes.includes(Number(p.region_code)));
    }

    if (searchQuery) {
      places = places.filter((p) => p.name.includes(searchQuery));
    }

    if (mode === 'child' && selectedFilters.length > 0) {
      places = places.filter((p) => selectedFilters.includes(p.category));
    }

    if (showOpenOnly) places = places.filter((p) => p.isOpen);
    if (mode === 'child' && showDeliveryOnly) places = places.filter((p) => p.delivery);

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

  const handlePanelApply = (filters, hasActive) => {
    setPanelFilters(filters);
    setDetailFilterActive(hasActive);
    setIsFilterOpen(false);
  };

  const handleOpenFilter = (pos) => {
    if (pos?.top) setPanelTop(pos.top);
    setIsFilterOpen(true);
  };

  const handleModeChange = (newMode) => {
    // ... (모드 변경 로직 동일) ...
    setMode(newMode);
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setSelectedPlace(null);
    setShowOpenOnly(false);
    setShowDeliveryOnly(false);
    setPanelFilters({ targets: [], days: [], times: [], region: null });
    setIsFilterOpen(false);
    setIsLocationFocused(false);
  };

  const handleSelectPlace = (place) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsDetailCollapsed(false);
    setSelectedPlace(place);
  };

  return (
    <div className="relative w-full h-screen overflow-visible flex flex-col">
      {/* ... (스타일 및 토스트 동일) ... */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          .animate-fadeInOut {
            animation: fadeInOut 2s ease-in-out;
          }
        `}
      </style>

      {/* 토스트 노티 */}
      {copyToast && (
        <div
          className={`
          fixed top-6 left-1/2 transform -translate-x-1/2
          px-6 py-2 rounded-[5px]
          bg-black-_70 text-white-_100 text-[14px]
          shadow-[0_2px_5px_rgba(0,0,0,0.25)] z-[9999]
          animate-fadeInOut
        `}
        >
          복사가 완료되었습니다.
        </div>
      )}

      <CategoryToggle mode={mode} onModeChange={handleModeChange} />

      <div className="flex w-full h-full">
        {/* ⭐ [핵심 수정] Sidebar를 div로 감싸고 onMouseDown에서 이벤트 전파를 막습니다(stopPropagation).
             이렇게 하면 사이드바를 클릭했을 때 '바깥 클릭'으로 인식되어 패널이 닫히는 것을 방지합니다. */}
        <div className="z-20 h-full flex-shrink-0" onMouseDown={(e) => e.stopPropagation()}>
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
            setSelectedPlace={handleSelectPlace}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
            showDeliveryOnly={showDeliveryOnly}
            setShowDeliveryOnly={setShowDeliveryOnly}
            onOpenFilter={handleOpenFilter}
            detailFilterActive={detailFilterActive}
            setDetailFilterActive={setDetailFilterActive}
            panelFilters={panelFilters}
          />
        </div>

        {/* DetailPanel */}
        {selectedPlace && (
          <div
            className="absolute z-30"
            style={{
              top: '50%',
              left: '396px',
              transform: 'translateY(-50%)',
              width: isDetailCollapsed ? '42px' : '380px',
            }}
            // ⭐ 패널 자체를 눌렀을 때도 닫히지 않도록 여기서도 막아두면 안전합니다.
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DetailPanel
              // 키 값을 주어 장소가 바뀌면 아예 새로 렌더링되게 하여 상태 꼬임을 방지합니다.
              key={selectedPlace.id}
              place={selectedPlace}
              mode={mode}
              isCollapsed={isDetailCollapsed}
              onToggleCollapse={toggleDetailCollapse}
              onClose={closeDetailPanel}
              onCopySuccess={handleCopySuccess}
            />
          </div>
        )}

        {/* 지도 영역 */}
        <div className="relative flex-1 h-full">
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
              className="absolute left-[px] z-50 p-2 pointer-events-none flex flex-col justify-start"
              style={{
                top: `${Math.max(0, panelTop - 24)}px`,
              }}
              // 필터 패널 클릭 시에도 닫히지 않게 처리
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-auto h-full">
                <FilterPanel
                  initialFilters={panelFilters}
                  onApply={handlePanelApply}
                  onCancel={() => {
                    setIsFilterOpen(false);
                    setDetailFilterActive(false);
                    setPanelFilters({ targets: [], days: [], times: [], region: null });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
