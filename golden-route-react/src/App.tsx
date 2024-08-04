import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import { fetchFlights } from './services/flightService';
import { haversineDistance } from './utils/distanceUtil';

export interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  src: { lat: number; lng: number }; // Source location
  dest: { lat: number; lng: number }; // Destination location
  departureTime: number; // Unix timestamp
  duration: number; // Duration in hours
  closingTime?: string;
  elapsedTime?: string;
  remainingTime?: string;
}

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
    
      const fetchedFlights = await fetchFlights(begin, end);
      console.log('Fetched Flights:', fetchedFlights);
      const flightsInRadius = fetchedFlights.filter((flight) => {
        const distance = haversineDistance(location.lat, location.lng, flight.latitude, flight.longitude);
        return distance <= radius;
      });
  
      console.log('Flights in Radius:', flightsInRadius);
  
      const flightsWithDetails = flightsInRadius.map((flight) => {
        const distance = haversineDistance(location.lat, location.lng, flight.latitude, flight.longitude);
        const closingTime = speed > 0 ? distance / speed : Infinity;
        const now = Math.floor(Date.now() / 1000);
        const elapsed = now - flight.departureTime;
        const remainingTime = flight.duration - (elapsed / 3600);
    
        return {
          ...flight,
          closingTime: closingTime.toFixed(2),
          elapsedTime: (elapsed / 3600).toFixed(2),
          remainingTime: remainingTime.toFixed(2),
        };
      });
    
      console.log('Flights with Details:', flightsWithDetails);
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
      
      const fetchedFlights = await fetchFlights(begin, end);
      const flightsInRadius = fetchedFlights.filter((flight) => {
        const distance = haversineDistance(selectedLocation.lat, selectedLocation.lng, flight.latitude, flight.longitude);
        return distance <= newRadius;
      });

      const flightsWithDetails = flightsInRadius.map((flight) => {
        const distance = haversineDistance(selectedLocation.lat, selectedLocation.lng, flight.latitude, flight.longitude);
        const closingTime = speed > 0 ? distance / speed : Infinity;
        return {
          ...flight,
          closingTime: closingTime.toFixed(2),
        };
      });

      setFlights(flightsWithDetails);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(event.target.value);
    setSpeed(newSpeed);

    if (selectedLocation && radius > 0) {
      const updateFlights = async () => {
        const begin = Math.floor(Date.now() / 1000) - 3600;
        const end = Math.floor(Date.now() / 1000);
        
        const fetchedFlights = await fetchFlights(begin, end);
        const flightsInRadius = fetchedFlights.filter((flight) => {
          const distance = haversineDistance(selectedLocation.lat, selectedLocation.lng, flight.latitude, flight.longitude);
          return distance <= radius;
        });

        const flightsWithDetails = flightsInRadius.map((flight) => {
          const distance = haversineDistance(selectedLocation.lat, selectedLocation.lng, flight.latitude, flight.longitude);
          const closingTime = newSpeed > 0 ? distance / newSpeed : Infinity;
          return {
            ...flight,
            closingTime: closingTime.toFixed(2),
          };
        });

        setFlights(flightsWithDetails);
      };

      updateFlights();
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
        {flights.map((flight, index) => (
          <li key={index}>
            {flight.callsign || 'No Callsign'} - Latitude: {flight.latitude ?? 'N/A'}, Longitude: {flight.longitude ?? 'N/A'}
            <br />
            Source: Latitude {flight.src?.lat ?? 'N/A'}, Longitude {flight.src?.lng ?? 'N/A'}
            <br />
            Destination: Latitude {flight.dest?.lat ?? 'N/A'}, Longitude {flight.dest?.lng ?? 'N/A'}
            <br />
            Flight Duration: {flight.duration ?? 'N/A'} hours
            <br />
            Time Passed: {flight.elapsedTime ?? 'N/A'} hours
            <br />
            Remaining Time: {flight.remainingTime ?? 'N/A'} hours
            <br />
            Closing Time: {flight.closingTime ?? 'N/A'} hours
          </li>
        ))}
      </ul>
    </div>
  );  
};

export default App;
