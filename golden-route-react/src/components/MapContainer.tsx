import React from 'react';
import MapComponent from './MapComponent';
import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_API } from '../KEYS';

interface MapContainerProps {
  handleLocationSelect: (location: { lat: number; lng: number }) => void;
  userLocation: { lat: number; lng: number } | null;
  flight: any;
  selectedLocation: { lat: number; lng: number } | null;
  radius: number;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  handleLocationSelect, 
  userLocation, 
  flight, 
  selectedLocation, 
  radius 
}) => (
  <section className="app-section">
    <h2>Choose a Location:</h2>
    <h3>Ctrl + Mouse Wheel To Zoom In/Out:</h3>
    <APIProvider apiKey={GOOGLE_API}>
      <MapComponent 
        onLocationSelect={handleLocationSelect} 
        userLocation={userLocation}
        planeLocation={{ lat: flight?.latitude || 0, lng: flight?.longitude || 0 }}
        selectedLocation={selectedLocation} 
        radius={radius}
      />
    </APIProvider>
  </section>
);

export default MapContainer;