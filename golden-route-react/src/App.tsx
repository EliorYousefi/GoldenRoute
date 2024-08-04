import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import { fetchFlights } from './services/flightService';
import { haversineDistance } from './utils/distanceUtil';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [flights, setFlights] = useState<any[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);

    if (location && radius > 0) {
      const begin = Math.floor(Date.now() / 1000) - 3600;
      const end = Math.floor(Date.now() / 1000);
      
      const fetchedFlights = await fetchFlights(begin, end);
      const flightsInRadius = fetchedFlights.filter((flight: any) => {
        const distance = haversineDistance(location.lat, location.lng, flight.latitude, flight.longitude);
        return distance <= radius;
      });

      setFlights(flightsInRadius);
    }
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(event.target.value));
  };

  const captureScreenshot = () => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      html2canvas(mapElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        setScreenshot(imgData);
      });
    }
  };

  return (
    <div>
      <h2>Choose a Location:</h2>
      <MapComponent onLocationSelect={handleLocationSelect} radius={radius} flights={flights} />
      <br />
      {selectedLocation && (
        <div>
          <h2>Selected Location:</h2>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lng}</p>
        </div>
      )}
      <h2>Enter max flight radius:</h2>
      <input 
        type="number" 
        value={radius} 
        onChange={handleRadiusChange} 
        placeholder="Enter Max Flight Radius..." 
      />
      <button onClick={captureScreenshot}>Capture Screenshot</button>
      {screenshot && (
        <div>
          <h2>Map Screenshot:</h2>
          <img src={screenshot} alt="Map Screenshot" style={{ width: '100%', maxWidth: '600px' }} />
        </div>
      )}
      <h2>Flights in Radius:</h2>
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>
            {flight.callsign} - Latitude: {flight.latitude}, Longitude: {flight.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
