import { Router } from 'express';
import {
  getInventory,
  getInventoryItemById,
  createInventoryItem,
  updateStock,
  getTransactions
} from '../controllers/inventory.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getInventory);
router.get('/transactions', getTransactions);
router.get('/:id', getInventoryItemById);
router.post('/', authenticateToken, createInventoryItem);
router.patch('/:id/stock', authenticateToken, updateStock);

export default router;
