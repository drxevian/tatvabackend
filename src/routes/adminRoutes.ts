import express from 'express';
import { verifyAdminToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const router = express.Router();

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Check credentials (in a real app, you'd use a database)
  if (email === 'admin@admin' && password === 'admin') {
    // Create JWT token
    const token = jwt.sign({ email, role: 'admin' }, env.jwtSecret, { expiresIn: '1d' });
    
    // Set cookie with token
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    return res.json({ success: true });
  }
  
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Admin logout route
router.post('/logout', (req, res) => {
  // Clear the cookie by setting it to expire in the past
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  });
  
  return res.json({ success: true });
});

// Check if the admin is authenticated
router.get('/check-auth', verifyAdminToken, (req, res) => {
  res.json({ authenticated: true });
});

export default router;
