import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveLocation = async (req: Request, res: Response): Promise<void> => {
  const { uavLocation, radius, speed, planeLocation, callsign, origin_country, closureTime } = req.body;
  
  try {
    const location = await prisma.location.create({
      data: {
        uavLocationLat: uavLocation.lat,
        uavLocationLng: uavLocation.lng,
        radius,
        speed,
        planeLocationLat: planeLocation.lat,
        planeLocationLng: planeLocation.lng,
        callsign,
        origin_country,
        closureTime,
      },
    });

    res.status(201).json(location);
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).send('Error saving location');
  }
};

export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (error) {
    console.error('Error retrieving locations:', error);
    res.status(500).send('Error retrieving locations');
  }
};

export const importLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const location = await prisma.location.findUnique({
      where: { id: Number(id) },
    });

    if (location) {
      res.status(200).json({ message: 'Location imported successfully!' });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Error importing location:', error);
    res.status(500).send('Error importing location');
  }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedLocation = await prisma.location.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedLocation);
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).send('Error deleting location');
  }
};

export const deleteAllLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedLocations = await prisma.location.deleteMany();
    res.status(200).json(deletedLocations);
  } catch (error) {
    console.error('Error deleting all locations:', error);
    res.status(500).send('Error deleting all locations');
  }
};
