import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found in polar personnel directory.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, station_code: user.station_code },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password_hash, ...userProfile } = user;

    db.activityLogs.create({
      action: 'LOGIN',
      station_code: user.station_code,
      user_name: user.full_name,
      details: `Operator authenticated session as ${user.role} (${user.designation}).`
    });

    res.json({
      success: true,
      token,
      user: userProfile
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  const { password_hash, ...userProfile } = req.user;
  res.json({ success: true, user: userProfile });
};

export const getDemoAccounts = async (req, res) => {
  const accounts = db.users.all().map(u => ({
    email: u.email,
    full_name: u.full_name,
    role: u.role,
    station_code: u.station_code,
    designation: u.designation,
    default_password: 'antarsetu123'
  }));
  res.json({ success: true, data: accounts });
};
