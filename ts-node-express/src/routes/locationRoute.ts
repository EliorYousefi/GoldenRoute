import { Router } from 'express';
import { saveLocation, getLocations, importLocation, deleteLocation, deleteAllLocations } from '../handlers/locationHandler';

const router = Router();

// route http routes
router.post('/locations', saveLocation);
router.get('/locations', getLocations);
router.post('/import-location/:id', importLocation);
router.delete('/locations/:id', deleteLocation);  
router.delete('/locations', deleteAllLocations); 

export default router;
