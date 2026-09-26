import { Router } from 'express';
import { getPersonnel, getPersonnelById, getPersonnelSummary, updatePersonnel } from '../controllers/personnel.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getPersonnel);
router.get('/summary', getPersonnelSummary);
router.get('/:id', getPersonnelById);
router.patch('/:id', authenticateToken, updatePersonnel);

export default router;
