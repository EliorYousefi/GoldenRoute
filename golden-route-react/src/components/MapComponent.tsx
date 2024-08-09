import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker} from '@vis.gl/react-google-maps';
import * as pin from '../assets/uav.png';
import * as airplane from '../assets/airplane.png';

// Define the type for the location
interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onLocationSelect: (location: Location) => void;
  userLocation: Location | null; // Added prop for user location
  planeLocation: Location | null; // Added prop for user location
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, userLocation, planeLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Simplified getUserLocation function
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(location);
          onLocationSelect(location);
        },
        (error) => {
          console.error('Error fetching user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []); // Only run once on component mount

  const handleMapClick = (event: any) => {
    if (event.detail.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      const location = { lat, lng };
      setSelectedLocation(location);
      onLocationSelect(location);
    } else {
      alert('Please select the specific location');
    }
  };

  const markerLocation = selectedLocation || userLocation || { lat: 0, lng: 0 };

  return (
    <div className="map-container" >
      <Map
        style={{ borderRadius: '20px' }}
        defaultZoom={13}
        defaultCenter={userLocation || { lat: 0, lng: 0 }}
        gestureHandling="greedy"
        onClick={handleMapClick}
        mapId='c3fc10d89244a2e5'
      >
        {selectedLocation && (
          <AdvancedMarker position={markerLocation}>
            <img src={pin.default} width={64} height={20} />
          </AdvancedMarker>
        )}
        {planeLocation?.lat !== 0 && planeLocation?.lat !== 0 && (
          <AdvancedMarker position={planeLocation}>
            <img src={airplane.default} width={64} height={40} />
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
