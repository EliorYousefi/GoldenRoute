import { Router } from 'express';
import { findNearestPlane, calculateClosureTime } from '../controllers/planeController';

const router = Router();

router.get('/nearest-plane', findNearestPlane);

router.get('/closure-time', calculateClosureTime);

export default router;
