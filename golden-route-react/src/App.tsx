import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import { Flight } from './interfaces/flightInterface';
import { getNearestFlight, calculateClosureTime } from './services/api';
import './App.css';
import { GOOGLE_API } from './KEYS';
import { APIProvider } from "@vis.gl/react-google-maps";

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closureTime, setClosureTime] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            setSelectedLocation(location); // Optional: center the map on user location
          },
          (error) => {
            console.error('Error fetching user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, []); // Only run once on component mount

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
    <div className="app-container">
      <h1 className="app-header">Golden Route - Elior Yousefi</h1>
      <section className="app-section">
        <h2>Choose a Location:</h2>
        <h3>Ctrl + Mouse Wheel To Zoom In/Out:</h3>
        <APIProvider apiKey={GOOGLE_API}>
          <MapComponent 
            onLocationSelect={handleLocationSelect} 
            userLocation={userLocation}
            planeLocation={{ lat: flight?.latitude || 0, lng: flight?.longitude || 0}}
          />
        </APIProvider>
      </section>

      {selectedLocation && (
        <section className="app-section">
          <h2>Selected Location:</h2>
          <p><strong>Latitude:</strong> {selectedLocation.lat} <strong>Longitude:</strong> {selectedLocation.lng}</p>
        </section>
      )}

      <section className="app-section">
        <div className="input-container">
          <div className="input-group">
            <label htmlFor="radius">Enter Max Flight Radius: </label>
            <input 
              id="radius"
              type="number" 
              value={radius} 
              onChange={handleRadiusChange} 
              placeholder="Enter Max Flight Radius..." 
              className="app-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="speed">Enter Speed: </label>
            <input 
              id="speed"
              type="number" 
              value={speed} 
              onChange={handleSpeedChange} 
              placeholder="Enter Speed..." 
              className="app-input"
            />
          </div>
        </div>
      </section>

      <section className="app-section">
        <h2>Nearest Flight in Radius:</h2>
        <ul className="app-list">
          {flight ? (
            <li>
              <p><strong>Callsign:</strong> {flight.callsign || 'No Callsign'}</p>
              <p><strong>Latitude:</strong> {flight.latitude ?? 'N/A'}</p>
              <p><strong>Longitude:</strong> {flight.longitude ?? 'N/A'}</p>
              <p><strong>Origin Country:</strong> {flight.origin_country ?? 'N/A'}</p>
              <p><strong>Closure Time:</strong> {speed !== 0 && closureTime !== null && !isNaN(closureTime) ? formatClosureTime(closureTime) : 'N/A'}</p>
            </li>
          ) : (
            <p>No flights available within the selected radius and location.</p>
          )}
        </ul>
      </section>
      {/* {error && (
        <section className="app-error">
          <p>{error}</p>
        </section>
      )} */}
    </div>
  );
};

export default App;
