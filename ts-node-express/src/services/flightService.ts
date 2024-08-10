import axios from 'axios';
import dotenv from "dotenv";
import { Flight } from '../interfaces/flightInterface';

dotenv.config();

// Fetch flights from the OpenSky Network API
export const fetchFlights = async (): Promise<Flight[]> => {
  try {
    const begin = Math.floor(Date.now() / 1000) - 3600;
    const end = Math.floor(Date.now() / 1000);

    const response = await axios.get(`http://opensky-network.org/api/states/all`, {
      params: { begin, end },
      auth: {
        username: 'EliorY' || '',
        password: 'Elior2019!' || '',
      },
    });

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

    return flights;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw new Error('Error fetching flights');
  }
};