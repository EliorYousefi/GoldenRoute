import { Request, Response } from 'express';
import { getDistance } from 'geolib';

export const findNearestPlane = (req: Request, res: Response) => {
  const { lat1, lon1, lat2, lon2 } = req.query;

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // distance is in meters
  const distance = getDistance(
    { latitude: parseFloat(lat1 as string), longitude: parseFloat(lon1 as string) },
    { latitude: parseFloat(lat2 as string), longitude: parseFloat(lon2 as string) }
  );

  // convert distance to kilometers
  res.json({ distance: distance / 1000 });
};

export const calculateClosureTime = (req: Request, res: Response) => {
  const { distance, speed } = req.query;

  if (!distance || !speed) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const closureTime = parseFloat(distance as string) / parseFloat(speed as string);

  res.json({ closureTime });
};
