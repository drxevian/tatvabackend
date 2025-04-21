import express from 'express';
import { verifyAdminToken } from '../middleware/auth';

const router = express.Router();

// Check if the admin is authenticated
router.get('/check-auth', verifyAdminToken, (req, res) => {
  res.json({ authenticated: true });
});

export default router; 
