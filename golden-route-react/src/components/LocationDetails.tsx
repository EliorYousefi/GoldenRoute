import React from 'react';

interface LocationDetailsProps {
  selectedLocation: { lat: number; lng: number } | null;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ selectedLocation }) => (
  selectedLocation && (
    <section className="app-section">
      <h2>Selected Location:</h2>
      <p><strong>Latitude:</strong> {selectedLocation.lat} <strong>Longitude:</strong> {selectedLocation.lng}</p>
    </section>
  )
);

export default LocationDetails;