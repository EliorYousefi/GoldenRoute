import axios from 'axios';
import dotenv from "dotenv";
import { Flight } from '../interfaces/flightInterface';

const baseUrl = 'https://opensky-network.org/api';
dotenv.config();

// check if the flight is valid
function isValidFlight(flight: Flight): flight is Flight {
  return flight.latitude !== null && flight.longitude !== null;
}

// fetch flights from the OpenSky Network API
export async function fetchFlights(begin: number, end: number): Promise<Flight[]> {
  try {
    // API request with basic authentication
    const response = await axios.get(`${baseUrl}/states/all`, {
      params: {
        begin,
        end,
      },
      auth: {
        username: process.env.FLIGHT_USERNAME || '',
        password: process.env.FLIGHT_PASSWORD || '',
      },
    });

    console.log(response);

    // map the API response data
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
      closingTime: null, // null by default
    }));

    // filter invalid flights
    const flightsWithDetails: Flight[] = flights
      .filter(isValidFlight)
      .map((flight) => {
        const src = flight.origin_country;

        return {
          ...flight,
          src,
          closingTime: flight.closingTime !== null ? flight.closingTime : null, // null by default...
        };
      });

    return flightsWithDetails;
  } catch (error) {
    console.error('Error fetching flights:', error);
    return []; // return an empty array on error
  }
}
