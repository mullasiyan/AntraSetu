import { Router } from 'express';
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident
} from '../controllers/incidents.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/', authenticateToken, createIncident);
router.patch('/:id', authenticateToken, updateIncident);

export default router;
