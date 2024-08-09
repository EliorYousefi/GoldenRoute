import { Router } from 'express';
import { handleFindNearestPlane, calculateClosureTime } from '../handlers/routeHandler';

const router = Router();

router.get('/nearest-flight', handleFindNearestPlane);

router.get('/closure-time', calculateClosureTime);


export default router;
