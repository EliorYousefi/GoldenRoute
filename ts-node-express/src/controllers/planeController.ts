import { getDistance } from 'geolib';
import { Flight } from '../interfaces/flightInterface';

export const findNearestPlane = (
  flights: Flight[],
  userLocation: { latitude: number; longitude: number }
): { nearestFlight: Flight | null; distance: number } => {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    throw new Error('Invalid user location');
  }

  if (flights.length === 0) {
    return { nearestFlight: null, distance: Infinity };
  }

  let nearestFlight: Flight | null = null;
  let minDistance = Infinity;

  for (const flight of flights) {
    if (!flight.latitude || !flight.longitude) {
      continue; // Skip flights with invalid locations
    }

    const flightLocation = {
      latitude: flight.latitude,
      longitude: flight.longitude,
    };

    try {
      const distance = getDistance(userLocation, flightLocation);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestFlight = flight;
      }
    } catch (error) {
      console.error('Error calculating distance for flight:', error);
      continue; // Skip this flight if there's an error in distance calculation
    }
  }

  return { nearestFlight, distance: minDistance / 1000 }; // Convert distance to kilometers
};
