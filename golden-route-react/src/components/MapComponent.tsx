import React, { useState } from 'react';
import { Map, AdvancedMarker, Pin  } from '@vis.gl/react-google-maps';
import * as pin from '../assets/uav.png';

// Define the type for the location
interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onLocationSelect: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleMapClick = (event: any) => {
    // Check if latLng is present and extract the coordinates
    if (event.detail.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      console.log('Selected location:', { lat, lng }); // Debug the selected location
      const location = { lat, lng };
      setSelectedLocation(location);
      onLocationSelect(location); // Pass the selected location to the parent component
    } else {
      // Show alert message if latLng is not available
      alert('Please select the specific location');
    }
  };

  const markerLocation = selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : { lat: 0, lng: 0 }; // Default location

  return (
    <div className="map-container" style={{ height: '300px', width: '100%' }}>
      <Map
        style={{ borderRadius: '20px' }}
        defaultZoom={13}
        defaultCenter={markerLocation}
        
        gestureHandling="greedy"
        disableDefaultUI
        onClick={handleMapClick}
        
        mapId='c3fc10d89244a2e5'
      >
        {selectedLocation && <AdvancedMarker  position={markerLocation}>
          <img src={pin.default} width={64} height={20} />
        </AdvancedMarker>}
      </Map>
    </div>
  );
};

export default MapComponent;
