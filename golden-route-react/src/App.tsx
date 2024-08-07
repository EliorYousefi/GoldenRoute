import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import { fetchAndProcessFlights } from './services/flightService';
import { Flight } from './interfaces/flightInterface';

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [flights, setFlights] = useState<Flight[]>([]);

  const handleLocationSelect = async (location: { lat: number; lng: number }, radius: number, speed: number) => {
    setSelectedLocation(location);

    if (location && radius > 0) {
      const begin = Math.floor(Date.now() / 1000) - 3600;
      const end = Math.floor(Date.now() / 1000);

      const flightsWithDetails = await fetchAndProcessFlights(begin, end, location, radius, speed);
      setFlights(flightsWithDetails);
    } else {
      setFlights([]);
    }
  };

  const handleRadiusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(event.target.value);
    setRadius(newRadius);

    if (selectedLocation && newRadius > 0) {
      const begin = Math.floor(Date.now() / 1000) - 3600;
      const end = Math.floor(Date.now() / 1000);

      const flightsWithDetails = await fetchAndProcessFlights(begin, end, selectedLocation, newRadius, speed);
      setFlights(flightsWithDetails);
    }
  };

  const handleSpeedChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(event.target.value);
    setSpeed(newSpeed);

    if (selectedLocation && radius > 0) {
      const begin = Math.floor(Date.now() / 1000) - 3600;
      const end = Math.floor(Date.now() / 1000);

      const flightsWithDetails = await fetchAndProcessFlights(begin, end, selectedLocation, radius, newSpeed);
      setFlights(flightsWithDetails);
    }
  };

  return (
    <div>
      <h2>Choose a Location:</h2>
      <MapComponent onLocationSelect={handleLocationSelect} radius={radius} speed={speed} flights={flights} />
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
      <h2>Enter speed:</h2>
      <input 
        type="number" 
        value={speed} 
        onChange={handleSpeedChange} 
        placeholder="Enter Speed..." 
      />
      <h2>Flights in Radius:</h2>
      <ul>
      {flights.length > 0 ? (
        <ul>
          {flights.map((flight, index) => (
            <li key={index}>
              {flight.callsign || 'No Callsign'} - Latitude: {flight.latitude ?? 'N/A'}, Longitude: {flight.longitude ?? 'N/A'}
              <br />
              Origin Country: {flight.src ?? 'N/A'}
              <br />
              Closing Time: {flight.closingTime !== null ? flight.closingTime.toFixed(2) : 'N/A'} hours
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights available within the selected radius and location.</p>
      )}
      </ul>
    </div>
  );
};

export default App;
