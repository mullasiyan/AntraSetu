import { Router } from 'express';
import { getOperationalSummary, exportToCSV } from '../controllers/reports.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authenticateToken, getOperationalSummary);
router.get('/export/csv', exportToCSV);

export default router;
