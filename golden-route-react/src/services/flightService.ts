import axios from 'axios';

const baseUrl = 'https://opensky-network.org/api';

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

interface ValidFlight {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
}

function isValidFlight(flight: RawFlight): flight is ValidFlight {
  return flight.latitude !== null && flight.longitude !== null;
}

export async function fetchFlights(begin: number, end: number): Promise<ValidFlight[]> {
  try {
    const response = await axios.get(`${baseUrl}/states/all`, {
      params: {
        begin,
        end,
      },
    });

    return response.data.states
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
      .filter(isValidFlight);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}
