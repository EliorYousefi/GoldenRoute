import axios from 'axios';
import { Flight, FlightBrief} from '../interfaces/flightInterface';
import { getDistance } from './api';
import {FLIGHT_USERNAME, FLIGHT_PASSWORD} from '../KEYS'
const baseUrl = 'https://opensky-network.org/api';

// Type guard to check if the flight is valid
function isValidFlight(flight: Flight): flight is Flight {
  return flight.latitude !== null && flight.longitude !== null;
}

// Function to fetch flights from the OpenSky Network API
export async function fetchFlights(begin: number, end: number): Promise<Flight[]> {
  try {
    // Make the API request with basic authentication
    const response = await axios.get(`${baseUrl}/states/all`, {
      params: {
        begin,
        end,
      },
      auth: {
        username: FLIGHT_USERNAME,
        password: FLIGHT_PASSWORD,
      },
    });

    console.log(response);

    // Process the API response data
    const flights: Flight[] = response.data.states.map((state: any) => ({
      icao24: state[0],
      callsign: state[1] || '',
      origin_country: state[2],
      time_position: state[3],
      last_contact: state[4],
      longitude: state[5],
      latitude: state[6],
      baro_altitude: state[7],
      on_ground: state[8],
      velocity: state[9],
      true_track: state[10],
      vertical_rate: state[11],
      sensors: state[12],
      geo_altitude: state[13],
      squawk: state[14],
      spi: state[15],
      position_source: state[16],
      category: state[17],
      closingTime: null, // Ensure it's null by default
    }));

    // Convert RawFlight to ValidFlight
    const flightsWithDetails: Flight[] = flights
      .filter(isValidFlight)
      .map((flight) => {
        const src = flight.origin_country;

        return {
          ...flight,
          src,
          closingTime: flight.closingTime !== null ? flight.closingTime : null, // Ensure it's a number or null
        };
      });

    return flightsWithDetails;
  } catch (error) {
    console.error('Error fetching flights:', error);
    return []; // Return an empty array on error
  }
}

export const fetchAndProcessFlights = async (begin: number, end: number, location: { lat: number; lng: number }, radius: number, speed: number) => {
  const fetchedFlights = await fetchFlights(begin, end);

  const flightsWithDistances = await Promise.all(
    fetchedFlights.map(async (flight) => {
      const distance = await getDistance(location.lat, location.lng, flight.latitude, flight.longitude);
      return { flight, distance };
    })
  );

  const flightsInRadius = flightsWithDistances.filter(({ distance }) => distance <= radius);

  return flightsInRadius.map(({ flight, distance }) => {
    const closingTime = speed > 0 ? distance / speed : null;
    return {
      ...flight,
      closingTime,
    };
  });
};

export async function fetchAndFilterFlights(centerLat: number, centerLon: number, radius: number): Promise<FlightBrief[]> {
  const begin = Math.floor(Date.now() / 1000) - 3600;
  const end = Math.floor(Date.now() / 1000);

  const flights = await fetchFlights(begin, end);

  return Promise.all(
    flights.map(async (flight) => {
      const distance = await getDistance(centerLat, centerLon, flight.latitude, flight.longitude);
      return { flight, distance };
    })
  ).then(flightsWithDistances =>
    flightsWithDistances.filter(({ distance }) => distance <= radius).map(({ flight }) => flight)
  );
}
