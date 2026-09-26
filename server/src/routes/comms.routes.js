import { Router } from 'express';
import { getCommLogs, getCommWindows, getCommSummary } from '../controllers/comms.controller.js';

const router = Router();

router.get('/logs', getCommLogs);
router.get('/windows', getCommWindows);
router.get('/summary', getCommSummary);

export default router;
