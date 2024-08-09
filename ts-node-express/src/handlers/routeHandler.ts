import { Request, Response } from 'express';
import { fetchFlights } from '../services/flightService';  
import { findNearestPlane } from '../controllers/planeController';  
import { getDistance } from 'geolib';

export const handleFindNearestPlane = async (req: Request, res: Response): Promise<void> => {
  const { lat1, lon1 } = req.query;

  if (!lat1 || !lon1) {
    res.status(400).json({ error: 'Missing parameters' });
    return; 
  }

  const userLocation = {
    latitude: parseFloat(lat1 as string),
    longitude: parseFloat(lon1 as string),
  };

  try {
    const flights = await fetchFlights();
    
    if (!Array.isArray(flights)) {
      throw new Error('Invalid flights data');
    }

    const { nearestFlight, distance } = findNearestPlane(flights, userLocation);

    if (nearestFlight) {
      res.json({ nearestFlight, distance });
    } else {
      res.status(404).json({ message: 'No nearest flight found' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Error handling request');
  }
};

export const calculateClosureTime = (req: Request, res: Response) => {
    const { lat1, lon1, lat2, lon2, speed } = req.query;
    const uavLocation = {latitude: lat1 as string, longitude: lon1 as string};
    const flightLocation = {latitude: lat2 as string, longitude: lon2 as string};

    const distance = getDistance(uavLocation, flightLocation);

    if(distance == 0)
    {
      return res.status(400).json({ error: 'Distance is 0...' });
    }
    
    if (!distance || !speed) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
  
    const closureTime = distance / parseFloat(speed as string);
  
    res.json({ closureTime });
};
  