import { Router } from 'express';
import { db } from '../db/db.js';

const router = Router();

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25;
  const logs = db.activityLogs.find(limit);
  res.json({ success: true, count: logs.length, data: logs });
});

export default router;
