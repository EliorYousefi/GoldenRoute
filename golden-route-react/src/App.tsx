import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import InputFields from './components/InputFields';
import LocationDetails from './components/LocationDetails';
import NearestFlightDetails from './components/NearestFlightDetails';
import ButtonGroup from './components/ButtonGroup';
import UserLocation from './components/UserLocation';
import DataImportModal from './components/DataImportModal';
import { getNearestFlight, calculateClosureTime } from './services/api';
import { Flight } from './interfaces/flightInterface';
import './css/App.css';
import { ToastContainer, toast } from 'react-toastify';

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
      <UserLocation setUserLocation={setUserLocation} />
      <MapContainer 
        handleLocationSelect={handleLocationSelect} 
        userLocation={userLocation}
        flight={flight}
        selectedLocation={selectedLocation} 
        radius={radius}
      />
      <LocationDetails selectedLocation={selectedLocation} />
      <InputFields 
        radius={radius} 
        speed={speed} 
        handleRadiusChange={handleRadiusChange} 
        handleSpeedChange={handleSpeedChange} 
      />
      <NearestFlightDetails 
        flight={flight} 
        closureTime={closureTime} 
        speed={speed} 
      />
      <ButtonGroup 
        isSaveButtonDisabled={isSaveButtonDisabled} 
        openModal={openModal} 
        selectedLocation={selectedLocation} 
        radius={radius} 
        speed={speed} 
        flight={flight} 
        closureTime={closureTime}
      />
      <DataImportModal isOpen={modalIsOpen} onRequestClose={closeModal} onImport={handleImport} />
      <ToastContainer />
    </div>
  );
};

export default App;