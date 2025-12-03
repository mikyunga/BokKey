'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import MapContainer from '../components/common/map/MapContainer';
import CategoryToggle from '../components/common/map/CategoryToggle';
import Sidebar from '../components/common/map/SideBar';
import SideActionButtons from '../components/common/map/SideActionButtons';

import { CHILD_PLACES, SENIOR_PLACES } from '../constants/mockData';
import { REGIONS } from '../constants/region';

export default function MapPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('child');

  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDeliveryOnly, setShowDeliveryOnly] = useState(false);

  const handleMyLocation = () => {
    console.log('My Location button clicked');
  };

  const handleFavoritePage = () => {
    navigate('/favorites');
  };

  const filteredPlaces = useMemo(() => {
    const places = mode === 'child' ? CHILD_PLACES : SENIOR_PLACES;

    return places.filter((place) => {
      if (searchQuery && !place.name.includes(searchQuery)) return false;

      if (mode === 'child' && selectedFilters.length > 0) {
        if (!selectedFilters.includes(place.category)) return false;
      }

      if (sido) {
        const targetRegionCodes = REGIONS.filter(
          (r) => r.province === sido && (!sigungu || r.district === sigungu)
        ).map((r) => r.region_code);

        if (!place.region_code || !targetRegionCodes.includes(Number(place.region_code))) {
          return false;
        }
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
              onFavoritePage={handleFavoritePage}
            />
          </div>
          <MapContainer mode={mode} places={filteredPlaces} selectedPlace={selectedPlace} />
        </div>
      </div>
    </div>
  );
}
