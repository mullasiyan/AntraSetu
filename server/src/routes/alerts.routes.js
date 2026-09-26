import { Router } from 'express';
import {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  createAlert,
  getAlertSummary
} from '../controllers/alerts.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getAlerts);
router.get('/summary', getAlertSummary);
router.post('/', authenticateToken, createAlert);
router.post('/:id/acknowledge', authenticateToken, acknowledgeAlert);
router.post('/:id/resolve', authenticateToken, resolveAlert);

export default router;
