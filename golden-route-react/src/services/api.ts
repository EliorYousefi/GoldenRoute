import axios from 'axios';

const API_BASE_URL = 'http://localhost:4100/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getNearestFlight = async (
  lat1: number,
  lon1: number,
) => {
  try {
    const response = await api.get('/nearest-flight', {
      params: { lat1, lon1 },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching nearest flight:', error);
    throw error;
  }
};

export const calculateClosureTime = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  speed: number
) => {
  try {
    const response = await api.get('/closure-time', {
      params: { lat1, lon1, lat2, lon2, speed },
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating closure time:', error);
    throw error;
  }
};
