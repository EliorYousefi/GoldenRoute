import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import { Flight } from './interfaces/flightInterface';
import { getNearestFlight, calculateClosureTime } from './services/api';

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closureTime, setClosureTime] = useState<number | null>(null);

  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    update();
  };

  const handleRadiusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(event.target.value);
    setRadius(newRadius);
    update();
  };

  const handleSpeedChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(event.target.value);
    setSpeed(newSpeed);
    update();
  };

  const update = async () => {
    if (selectedLocation && speed > 0 && radius > 1) {
      try {
        const result = await getNearestFlight(selectedLocation.lat, selectedLocation.lng);
        setFlight(result.nearestFlight);

        if (result.nearestFlight) {
          const closureTimeResult = await calculateClosureTime(
            selectedLocation.lat,
            selectedLocation.lng,
            result.nearestFlight.latitude,
            result.nearestFlight.longitude,
            speed
          );
  
          setClosureTime(closureTimeResult.closureTime); 
        } else {
          setClosureTime(null);
        }
      } catch (error) {
        setError('Error fetching nearest flight or calculating closure time.');
        setFlight(null);
        setClosureTime(null);
      }
    }
  };

  const formatClosureTime = (timeInHours: number) => {
    const totalMinutes = Math.floor(timeInHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = Math.round((timeInHours * 3600) % 60);
    
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <div>
      <h2>Choose a Location:</h2>
      <MapComponent onLocationSelect={handleLocationSelect} radius={radius} speed={speed} />
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
      <h2>Nearest flight in radius:</h2>
      <ul>
        {flight ? (
          <>
            {flight.callsign || 'No Callsign'} - Latitude: {flight.latitude ?? 'N/A'}, Longitude: {flight.longitude ?? 'N/A'}
                <br />
                Origin Country: {flight.origin_country ?? 'N/A'}
                <br />
                Closing Time: {speed !== 0 && closureTime !== null && !isNaN(closureTime) ? formatClosureTime(closureTime) : 'N/A'}
          </>
        ) : (
          <p>No flights available within the selected radius and location.</p>
        )}
      </ul>
      {closureTime !== null && (
        <div>
          <h2>Closure Time:</h2>
          <p>{speed !== 0 && closureTime !== null && !isNaN(closureTime) ? formatClosureTime(closureTime) : 'N/A'}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
