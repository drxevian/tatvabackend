import express from 'express';
import { verifyAdminToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const router = express.Router();

// Admin login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // In a real application, you would verify these against a database
  // For now, using hardcoded credentials (replace with your actual admin credentials)
  if (email === 'admin@tatvaengineers.com' && password === 'admin123') {
    const token = jwt.sign(
      { email, role: 'admin' },
      env.jwtSecret,
      { expiresIn: '24h' }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Check if the admin is authenticated
router.get('/check-auth', verifyAdminToken, (req, res) => {
  res.json({ authenticated: true });
});

export default router;
