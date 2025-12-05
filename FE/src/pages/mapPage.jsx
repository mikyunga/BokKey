'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';
import SideActionButtons from '../components/common/map/SideActionButtons';
import FilterPanel from '../components/common/map/FilterPanel';
import DetailPanel from '../components/common/map/DetailPanel';

import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';
import { useFavorites } from '../contexts/FavoriteContext';

export default function MapPage() {
  const [mode, setMode] = useState('child');
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [showFavorites, setShowFavorites] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDeliveryOnly, setShowDeliveryOnly] = useState(false);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [detailFilterActive, setDetailFilterActive] = useState(false);
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(false);

  const [copyToast, setCopyToast] = useState(false);

  const [panelFilters, setPanelFilters] = useState({
    targets: [],
    days: [],
    times: [],
    region: null,
  });
  const [panelTop, setPanelTop] = useState(0);

  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const { favorites } = useFavorites();
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const handleMapReady = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
  }, []);

  // ⭐ [추가됨] 필터(카테고리, 지역, 검색 등)가 바뀌면 선택된 장소 해제
  // -> 그래야 MapContainer가 "선택된 게 없으니 전체 범위를 보여주자"라고 판단합니다.
  useEffect(() => {
    setSelectedPlace(null);
  }, [selectedFilters, searchQuery, sido, sigungu, showOpenOnly, showDeliveryOnly, panelFilters]);

  // 내 위치 기능
  const handleMyLocation = () => {
    if (isLocationFocused) {
      setIsLocationFocused(false);
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
        currentLocationMarkerRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('위치 기능을 사용할 수 없습니다.');
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mapRef.current) return;

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

  // 필터링 로직
  const filteredPlaces = useMemo(() => {
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

  const displayPlaces = useMemo(() => {
    if (showFavorites) {
      let favPlaces = favorites[mode] || [];
      if (showOpenOnly) favPlaces = favPlaces.filter((p) => p.isOpen);
      if (mode === 'child' && showDeliveryOnly) favPlaces = favPlaces.filter((p) => p.delivery);
      return favPlaces;
    }
    return filteredPlaces;
  }, [showFavorites, favorites, mode, filteredPlaces, showOpenOnly, showDeliveryOnly]);

  const handleModeChange = (newMode) => {
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
    setDetailFilterActive(false);

    setShowFavorites(false);
    setIsDetailCollapsed(false);

    setIsLocationFocused(false);
    setIsLoadingLocation(false);
    setLocationError(null);

    if (mapRef.current) {
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
        currentLocationMarkerRef.current = null;
      }
      const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.978);
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setLevel(3);
    }
  };

  const handleSelectPlace = (place) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsLocationFocused(false);
    setIsDetailCollapsed(false);
    setSelectedPlace(place);
  };

  const handlePanelApply = (filters, hasActive) => {
    setPanelFilters(filters);
    setDetailFilterActive(hasActive);
    setIsFilterOpen(false);
  };

  const handleOpenFilter = (pos) => {
    if (pos?.top) setPanelTop(pos.top);
    setIsFilterOpen(true);
  };

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

  const toggleDetailCollapse = () => setIsDetailCollapsed((prev) => !prev);

  useEffect(() => {
    if (!searchParams) return;
    const selectedId = searchParams.get('selected');
    const modeParam = searchParams.get('mode');
    if (selectedId) {
      if (modeParam && mode !== modeParam) {
        setMode(modeParam);
      }
      const target = displayPlaces.find((p) => String(p.id) === String(selectedId));
      if (target) {
        setSelectedPlace(target);
        setIsDetailCollapsed(false);
        // URL로 들어왔을 때만 예외적으로 여기서 이동 처리 (초기 로딩이므로 충돌 위험 적음)
        setTimeout(() => {
          if (mapRef.current) {
            const pos = new window.kakao.maps.LatLng(target.latitude, target.longitude);
            mapRef.current.panTo(pos);
            mapRef.current.setLevel(3);
          }
        }, 150);
      }
    }
  }, [displayPlaces, searchParams]);

  return (
    <div className="relative w-full h-screen overflow-visible flex flex-col">
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

      {copyToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-[5px] bg-black-_70 text-white-_100 text-[14px] shadow-[0_2px_5px_rgba(0,0,0,0.25)] z-[9999] animate-fadeInOut">
          복사가 완료되었습니다.
        </div>
      )}

      <CategoryToggle mode={mode} onModeChange={handleModeChange} />

      <div className="flex w-full h-full">
        <div className="z-20 h-full flex-shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <Sidebar
            mode={mode}
            showFavorites={showFavorites}
            onCloseFavorites={() => setShowFavorites(false)}
            places={displayPlaces}
            sido={sido}
            setSido={setSido}
            sigungu={sigungu}
            setSigungu={setSigungu}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            selectedPlace={selectedPlace}
            setSelectedPlace={handleSelectPlace}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
            showDeliveryOnly={showDeliveryOnly}
            setShowDeliveryOnly={setShowDeliveryOnly}
            onOpenFilter={handleOpenFilter}
            detailFilterActive={detailFilterActive}
            setDetailFilterActive={setDetailFilterActive}
          />
        </div>

        {selectedPlace && (
          <div
            className="absolute z-30"
            style={{
              top: '50%',
              left: '396px',
              transform: 'translateY(-50%)',
              width: isDetailCollapsed ? '42px' : '380px',
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DetailPanel
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

        <div className="relative flex-1 h-full">
          <div className="absolute left-6 top-6 z-40">
            <SideActionButtons
              onMyLocation={handleMyLocation}
              isLoadingLocation={isLoadingLocation}
              locationError={locationError}
              isLocationFocused={isLocationFocused}
              isFavoritesOpen={showFavorites}
              onToggleFavorites={() => setShowFavorites((prev) => !prev)}
            />
          </div>

          <MapContainer
            mode={mode}
            places={displayPlaces}
            selectedPlace={selectedPlace}
            onMapReady={handleMapReady}
            isLocationFocused={isLocationFocused} // ⭐ [수정됨] 이 prop이 있어야 내 위치 끌 때 전체 뷰로 돌아갑니다.
          />

          {isFilterOpen && (
            <div
              className="absolute left-[px] z-50 p-2 pointer-events-none flex flex-col justify-start"
              style={{
                top: `${Math.max(0, panelTop - 24)}px`,
              }}
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
