import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import * as pin from '../assets/uav.png';
import * as airplane from '../assets/airplane.png';

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onLocationSelect: (location: Location) => void;
  userLocation: Location | null;
  planeLocation: Location | null;
  selectedLocation: Location | null; 
  radius: number; // in kilometers
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, userLocation, planeLocation, selectedLocation, radius }) => {
  const [localSelectedLocation, setLocalSelectedLocation] = useState<Location | null>(selectedLocation);
  const [pinLocations, setPinLocations] = useState<Location[]>([]);

  useEffect(() => {
    setLocalSelectedLocation(selectedLocation); // update local state when location changes
  }, [selectedLocation]);

  useEffect(() => {
    if (localSelectedLocation && radius != 0) {
      const numberOfPins = 20;
      const angleIncrement = (2 * Math.PI) / numberOfPins;
      const radiusInDegrees = radius / 111.32; // Convert radius from km to degrees latitude

      const pins = Array.from({ length: numberOfPins }).map((_, i) => {
        const angle = angleIncrement * i;
        const latOffset = radiusInDegrees * Math.sin(angle);
        const lngOffset = (radiusInDegrees / Math.cos(localSelectedLocation.lat * Math.PI / 180)) * Math.cos(angle);

        const lat = localSelectedLocation.lat + latOffset;
        const lng = localSelectedLocation.lng + lngOffset;

        // Validate latitude and longitude
        return {
          lat: lat >= -90 && lat <= 90 ? lat : 0,
          lng: lng >= -180 && lng <= 180 ? lng : 0,
        };
      });

      setPinLocations(pins);
    }
  }, [localSelectedLocation, radius]);

  const handleMapClick = (event: any) => {
    if (event.detail.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      const location = { lat, lng };
      setLocalSelectedLocation(location);
      onLocationSelect(location);
    } else {
      alert('Please select the specific location');
    }
  };

  const markerLocation = localSelectedLocation || userLocation || { lat: 0, lng: 0 };

  return (
    <div className="map-container">
      <Map
        style={{ borderRadius: '20px' }}
        defaultZoom={13}
        defaultCenter={userLocation || { lat: 0, lng: 0 }}
        gestureHandling="greedy"
        onClick={handleMapClick}
        mapId='c3fc10d89244a2e5'
      >
        {localSelectedLocation && (
          <AdvancedMarker position={markerLocation}>
            <img src={pin.default} width={64} height={20} />
          </AdvancedMarker>
        )}
        {planeLocation?.lat !== 0 && planeLocation?.lng !== 0 && (
          <AdvancedMarker position={planeLocation}>
            <img src={airplane.default} width={64} height={40} />
          </AdvancedMarker>
        )}
        {pinLocations.map((loc, index) => (
          loc.lat !== 0 && loc.lng !== 0 && ( // Ensure valid coordinates
            <AdvancedMarker key={index} position={loc}>
              <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>
          )
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;