import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import { Flight } from './interfaces/flightInterface';
import { getNearestFlight, calculateClosureTime } from './services/api';
import './css/App.css';
import { GOOGLE_API } from './KEYS';
import { APIProvider } from "@vis.gl/react-google-maps";
import SaveButton from './components/SaveButton';
import DataImportModal from './components/DataImportModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EARTH_RADIUS_KM = 6371;

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [closureTime, setClosureTime] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
          },
          (error) => {
            console.error('Error fetching user location:', error);
            toast.error('Error fetching user location.');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        toast.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, []); 

  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    await update(location, radius, speed);
  };

  const handleRadiusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(event.target.value);
    if (newRadius >= 0 && newRadius <= EARTH_RADIUS_KM) {
      setRadius(newRadius);
      if (selectedLocation) {
        await update(selectedLocation, newRadius, speed); 
      }
    } else {
      toast.error('Radius must be between 0 and 6,371 km.');
    }
  };

  const handleSpeedChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(event.target.value);
    if (newSpeed >= 0) {
      setSpeed(newSpeed);
      if (selectedLocation) {
        await update(selectedLocation, radius, newSpeed); 
      }
    } else {
      toast.error('Speed must be greater than or equal to 0.');
    }
  };

  const update = async (location: { lat: number; lng: number }, radius: number, speed: number) => {
    if (location && speed > 0 && radius > 0) {
      try {
        const result = await getNearestFlight(location.lat, location.lng, radius);
        setFlight(result.nearestFlight);

        if (result.nearestFlight) {
          const closureTimeResult = await calculateClosureTime(
            location.lat,
            location.lng,
            result.nearestFlight.latitude,
            result.nearestFlight.longitude,
            speed
          );

          setClosureTime(closureTimeResult.closureTime); 
        } else {
          setClosureTime(null);
        }
      } catch (error) {
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

  const isSaveButtonDisabled = !selectedLocation || radius === 0 || speed === 0 || !flight;

  const handleImport = (location: any) => {
    setSelectedLocation({ lat: location.uavLocationLat, lng: location.uavLocationLng });
    setRadius(location.radius);
    setSpeed(location.speed);
    setClosureTime(location.closureTime);
    setFlight({
      icao24: '',
      latitude: location.planeLocationLat,
      longitude: location.planeLocationLng,
      callsign: location.callsign || '',
      origin_country: location.origin_country || '',
      time_position: 0,
      last_contact: 0,
      baro_altitude: 0,
      on_ground: false,
      velocity: 0,
      true_track: 0,
      vertical_rate: 0,
      sensors: [],
      geo_altitude: 0,
      squawk: '',
      spi: false,
      position_source: 0,
      category: 0,
      closingTime: location.closureTime || null, 
    });
    toast.success('Data imported successfully.');
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
            planeLocation={{ lat: flight?.latitude || 0, lng: flight?.longitude || 0 }}
            selectedLocation={selectedLocation} 
            radius={radius}
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
            <label htmlFor="radius">Enter Max Flight Radius (km): </label>
            <input 
              id="radius"
              type="number" 
              value={radius} 
              onChange={handleRadiusChange} 
              placeholder="Enter Max Flight Radius..." 
              className="app-input"
              min="0"
              max={EARTH_RADIUS_KM}
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
              min="0"
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

      <section className="app-section">
        <div className="button-group">
          <SaveButton 
            uavLocation={selectedLocation || { lat: 0, lng: 0 }} 
            radius={radius} 
            speed={speed} 
            planeLocation={{ lat: flight?.latitude || 0, lng: flight?.longitude || 0 }} 
            callsign={flight?.callsign || ''} 
            origin_country={flight?.origin_country || ''} 
            closureTime={closureTime || null} 
            disabled={isSaveButtonDisabled}
          />
          <button className="app-button" onClick={openModal}>Import Saved Data</button>
        </div>
        <DataImportModal isOpen={modalIsOpen} onRequestClose={closeModal} onImport={handleImport} />
      </section>

      <ToastContainer />
    </div>
  );
};

export default App;
