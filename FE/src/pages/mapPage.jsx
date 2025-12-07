'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';
import SideActionButtons from '../components/common/map/SideActionButtons';
import FilterPanel from '../components/common/map/FilterPanel';
import DetailPanel from '../components/common/map/DetailPanel';

import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';
import { useFavorites } from '../contexts/FavoriteContext';
import { IconBlack } from '../utils/icons';

// =====================================================================
// 1. 시간 파싱 및 비교 로직 (이전과 동일)
// =====================================================================

const parseTime = (str) => {
  if (!str || str.includes('휴무') || str.includes('정보 없음')) return null;
  if (!str.includes('~')) return null;

  const [open, close] = str.split('~').map((t) => t.trim());
  return { open, close };
};

const compareTime = (now, open, close) => {
  const [oH, oM] = open.split(':').map(Number);
  const [cH, cM] = close.split(':').map(Number);

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const openMin = oH * 60 + oM;
  const closeMin = cH * 60 + cM;

  if (closeMin < openMin) {
    return nowMin >= openMin || nowMin <= closeMin;
  }
  return nowMin >= openMin && nowMin <= closeMin;
};

// =====================================================================
// 2. 영업 상태 업데이트 함수
// =====================================================================

const updateOpenStatus = (places, now = new Date()) => {
  const currentDay = now.getDay();
  const isWeekend = currentDay === 0 || currentDay === 6;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDayName = dayNames[currentDay];

  return places.map((place) => {
    let targetTimeStr = place.time;

    // 주말/공휴일 시간 결정 로직
    if (isWeekend) {
      if (place.holidayTime && place.holidayTime.includes('휴무')) {
        targetTimeStr = null;
      } else if (
        place.holidayTime &&
        place.holidayTime.includes('~') &&
        place.holidayTime !== '0:00 ~ 0:00'
      ) {
        targetTimeStr = place.holidayTime;
      } else {
        targetTimeStr = place.time; // holidayTime 없으면 평일 시간 사용
      }
    }

    let isRealTimeOpen = false;
    const timeObj = parseTime(targetTimeStr);

    if (timeObj) {
      isRealTimeOpen = compareTime(now, timeObj.open, timeObj.close);
    }

    // 노인급식소 요일 체크
    if (place.meal_days && Array.isArray(place.meal_days)) {
      if (!place.meal_days.includes(currentDayName)) {
        isRealTimeOpen = false;
      }
    }

    return {
      ...place,
      isRealTimeOpen: isRealTimeOpen,
      isOpen: isRealTimeOpen, // UI 호환성
    };
  });
};

export default function MapPage() {
  const [mode, setMode] = useState('child');
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceMode, setSelectedPlaceMode] = useState(null);

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
  const currentLocationOverlayRef = useRef(null);
  const closeTimerRef = useRef(null);
  const modeRef = useRef(mode);

  // ⭐ Context에서 favorites 가져오기
  const { favorites } = useFavorites();
  const [searchParams, setSearchParams] = useState(null);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const handleMapReady = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
  }, []);

  useEffect(() => {
    setSelectedPlace(null);
    setSelectedPlaceMode(null);
  }, [
    selectedFilters,
    searchQuery,
    sido,
    sigungu,
    showOpenOnly,
    showDeliveryOnly,
    panelFilters,
    mode,
  ]);

  // =====================================================================
  // filteredPlaces (일반 모드 데이터)
  // =====================================================================
  const filteredPlaces = useMemo(() => {
    let places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;
    const now = new Date();

    let updatedPlaces = updateOpenStatus(places, now);

    if (sido) {
      const validCodes = REGIONS.filter(
        (r) => r.province === sido && (!sigungu || r.district === sigungu)
      ).map((r) => r.region_code);
      updatedPlaces = updatedPlaces.filter((p) => validCodes.includes(Number(p.region_code)));
    }

    if (searchQuery) {
      updatedPlaces = updatedPlaces.filter((p) => p.name.includes(searchQuery));
    }

    if (mode === 'child' && selectedFilters.length > 0) {
      updatedPlaces = updatedPlaces.filter((p) => selectedFilters.includes(p.category));
    }

    if (showOpenOnly) {
      updatedPlaces = updatedPlaces.filter((p) => p.isRealTimeOpen);
    }

    if (mode === 'child' && showDeliveryOnly)
      updatedPlaces = updatedPlaces.filter((p) => p.delivery);

    const { targets, days, times, region } = panelFilters;
    if (targets.length > 0) {
      updatedPlaces = updatedPlaces.filter((place) => {
        const rawTarget = place.targets || place.target_name;
        const arr = Array.isArray(rawTarget) ? rawTarget : rawTarget ? [rawTarget] : [];
        return targets.every((t) => arr.some((pt) => pt.includes(t)));
      });
    }
    if (days.length > 0) {
      updatedPlaces = updatedPlaces.filter((p) => days.every((d) => p.meal_days?.includes(d)));
    }
    if (times.length > 0) {
      updatedPlaces = updatedPlaces.filter((p) => times.every((t) => p.meal_time?.includes(t)));
    }
    if (region) {
      const value = region === 'nationwide' ? '전국' : '지역한정';
      updatedPlaces = updatedPlaces.filter((p) => p.target === value);
    }

    return updatedPlaces;
  }, [
    mode,
    sido,
    sigungu,
    searchQuery,
    selectedFilters,
    showOpenOnly,
    showDeliveryOnly,
    panelFilters,
    tick,
  ]);

  // =====================================================================
  // ⭐ displayPlaces (즐겨찾기 핀 문제 해결의 핵심!)
  // =====================================================================
  const displayPlaces = useMemo(() => {
    if (showFavorites) {
      const now = new Date();
      // 1. Context에 저장된 즐겨찾기 목록 가져오기 (여기에 옛날 데이터가 있을 수 있음)
      const rawFavs = favorites[mode] || [];

      // 2. 현재 소스 코드에 있는 최신 목데이터 가져오기
      const sourceData = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

      // 3. ⭐ 데이터 병합 (Hydration)
      // 저장된 즐겨찾기의 ID를 이용해 최신 목데이터를 찾아서 덮어씌웁니다.
      // 이렇게 하면 목데이터에 있는 최신 좌표(latitude, longitude)가 적용되어 핀이 살아납니다.
      let hydratedFavs = rawFavs.map((fav) => {
        const original = sourceData.find((p) => String(p.id) === String(fav.id));
        // 원본이 있으면 최신 데이터로 교체, 없으면(삭제된 데이터 등) 저장된 값 유지
        return original ? { ...fav, ...original } : fav;
      });

      // 4. 최신 데이터 기준으로 영업 시간 재계산
      hydratedFavs = updateOpenStatus(hydratedFavs, now);

      // 5. 필터링
      if (showOpenOnly) hydratedFavs = hydratedFavs.filter((p) => p.isRealTimeOpen);
      if (mode === 'child' && showDeliveryOnly)
        hydratedFavs = hydratedFavs.filter((p) => p.delivery);

      return hydratedFavs;
    }
    return filteredPlaces;
  }, [showFavorites, favorites, mode, filteredPlaces, showOpenOnly, showDeliveryOnly, tick]);

  const handleMyLocation = () => {
    if (isLocationFocused) {
      setIsLocationFocused(false);
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
        currentLocationMarkerRef.current = null;
      }
      if (currentLocationOverlayRef.current) {
        currentLocationOverlayRef.current.setMap(null);
        currentLocationOverlayRef.current = null;
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
        if (currentLocationOverlayRef.current) {
          currentLocationOverlayRef.current.setMap(null);
        }

        const markerImage = new window.kakao.maps.MarkerImage(
          IconBlack,
          new window.kakao.maps.Size(34, 34),
          { offset: new window.kakao.maps.Point(17, 17) }
        );

        const marker = new window.kakao.maps.Marker({
          position: kakaoLatLng,
          map: mapRef.current,
          image: markerImage,
        });

        currentLocationMarkerRef.current = marker;

        const overlayContent = document.createElement('div');
        overlayContent.style.cssText = `
          position: relative;
          bottom: 25px;
          background: white;
          padding: 4px 8px;
          border-radius: 5px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          font-size: 12px;
          font-weight: 600;
          color: black;
          white-space: nowrap;
          border: 1px solid rgba(0,0,0,0.3);
        `;

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

        overlayContent.textContent = '현 위치';
        overlayContent.appendChild(tail);

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: kakaoLatLng,
          content: overlayContent,
          yAnchor: 1,
        });

        customOverlay.setMap(mapRef.current);
        currentLocationOverlayRef.current = customOverlay;

        setIsLoadingLocation(false);
        setIsLocationFocused(true);
      },
      () => {
        setLocationError('위치를 가져올 수 없습니다.');
        setIsLoadingLocation(false);
      }
    );
  };

  const handleModeChange = (newMode) => {
    setSelectedPlace(null);
    setSelectedPlaceMode(null);
    setIsDetailCollapsed(false);

    setMode(newMode);
    setSelectedFilters([]);
    setSido('');
    setSigungu('');
    setSearchQuery('');
    setShowOpenOnly(false);
    setShowDeliveryOnly(false);
    setPanelFilters({ targets: [], days: [], times: [], region: null });
    setIsFilterOpen(false);
    setDetailFilterActive(false);
    setShowFavorites(false);
    setIsLocationFocused(false);
    setIsLoadingLocation(false);
    setLocationError(null);

    if (mapRef.current) {
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
        currentLocationMarkerRef.current = null;
      }
      if (currentLocationOverlayRef.current) {
        currentLocationOverlayRef.current.setMap(null);
        currentLocationOverlayRef.current = null;
      }
      const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.978);
      mapRef.current.panTo(defaultCenter);
      mapRef.current.setLevel(3);
    }
  };

  const handleSelectPlace = useCallback((place) => {
    const currentMode = modeRef.current;

    // ⭐ 클릭 시 디버깅 정보 출력
    console.error(
      `📍 [클릭] ${place.name} (현재상태: ${place.isRealTimeOpen ? '영업중' : '영업종료'})`
    );

    const isChildPlace = place?.category !== undefined;
    const isSeniorPlace = place?.target_name !== undefined || place?.meal_days !== undefined;

    if (currentMode === 'child' && !isChildPlace) return;
    if (currentMode === 'senior' && !isSeniorPlace) return;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsLocationFocused(false);
    setIsDetailCollapsed(false);
    setSelectedPlace(place);
    setSelectedPlaceMode(currentMode);
  }, []);

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
      setSelectedPlaceMode(null);
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
        setSelectedPlaceMode(modeParam || mode);
        setIsDetailCollapsed(false);
        setTimeout(() => {
          if (mapRef.current) {
            const pos = new window.kakao.maps.LatLng(target.latitude, target.longitude);
            mapRef.current.panTo(pos);
            mapRef.current.setLevel(3);
          }
        }, 150);
      }
    }
  }, [displayPlaces, searchParams, mode]);

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
            onModeChange={handleModeChange}
          />
        </div>

        <div className="relative flex-1 h-full">
          <AnimatePresence>
            {selectedPlace && selectedPlaceMode && (
              <motion.div
                key="detail-panel-wrapper"
                className="absolute z-30"
                style={{
                  top: '50%',
                  left: '24px',
                  width: isDetailCollapsed ? '42px' : '380px',
                }}
                onMouseDown={(e) => e.stopPropagation()}
                initial={{ opacity: 0, x: -20, y: '-50%' }}
                animate={{ opacity: 1, x: 0, y: '-50%' }}
                exit={{ opacity: 0, x: -20, y: '-50%', transition: { duration: 0.2 } }}
              >
                <DetailPanel
                  key={`${selectedPlaceMode}-${selectedPlace.id}`}
                  place={selectedPlace}
                  mode={selectedPlaceMode}
                  isCollapsed={isDetailCollapsed}
                  onToggleCollapse={toggleDetailCollapse}
                  onClose={closeDetailPanel}
                  onCopySuccess={handleCopySuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>

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
            onSelectPlace={handleSelectPlace}
            onMapReady={handleMapReady}
            isLocationFocused={isLocationFocused}
          />

          {isFilterOpen && (
            <div
              className="absolute z-50 p-2 pointer-events-none flex flex-col justify-start"
              style={{
                left: `0px`,
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
