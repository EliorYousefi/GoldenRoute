import axios from 'axios';

const baseUrl = 'https://opensky-network.org/api';

// Define the structure of the raw flight data
interface RawFlight {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number | null;
  latitude: number | null;
  on_ground: boolean;
  velocity: number;
  true_track: number;
}

// Define the structure of a valid flight data
interface ValidFlight {
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

// Type guard to check if the flight is valid
function isValidFlight(flight: RawFlight): flight is ValidFlight {
  return flight.latitude !== null && flight.longitude !== null;
}

// Function to fetch flights from the OpenSky Network API
export async function fetchFlights(begin: number, end: number): Promise<ValidFlight[]> {
  try {
    // Make the API request
    const response = await axios.get(`${baseUrl}/states/all`, {
      params: {
        begin,
        end,
      },
    });

    // Process the API response data
    const flights = response.data.states
      .map((state: any): RawFlight => ({
        icao24: state[0],
        callsign: state[1] || '',
        origin_country: state[2],
        longitude: state[5],
        latitude: state[6],
        on_ground: state[8],
        velocity: state[9],
        true_track: state[10],
      }))
      .filter(isValidFlight); // Filter out invalid flights

    return flights;
  } catch (error) {
    console.error('Error fetching flights:', error);
    return []; // Return an empty array on error
  }
}
