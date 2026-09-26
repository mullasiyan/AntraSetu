import { Router } from 'express';
import {
  getAllStations,
  getStationById,
  getStationTelemetryHistory,
  updateStation
} from '../controllers/stations.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllStations);
router.get('/:id', getStationById);
router.get('/:id/telemetry', getStationTelemetryHistory);
router.patch('/:id', authenticateToken, updateStation);

export default router;
