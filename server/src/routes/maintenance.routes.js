import { Router } from 'express';
import {
  getMaintenanceTasks,
  createMaintenanceTask,
  updateMaintenanceTask
} from '../controllers/maintenance.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getMaintenanceTasks);
router.post('/', authenticateToken, createMaintenanceTask);
router.patch('/:id', authenticateToken, updateMaintenanceTask);

export default router;
