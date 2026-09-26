import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'antarsetu_polar_secret_key_2026_scientific_mission';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Mission authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid station operator credentials.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Authentication token expired or signature invalid.' });
  }
}

// Role-based access control helper
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Station role '${req.user.role}' lacks sufficient clearance for this operation.`
      });
    }
    next();
  };
}
