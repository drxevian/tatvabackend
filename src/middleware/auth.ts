import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// Extend Express Request type to include admin property
declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('Verifying admin token...');
  console.log('Cookies:', req.cookies);
  
  const token = req.cookies.adminToken;

  if (!token) {
    console.log('No admin token found in cookies');
    return res.status(401).json({ authenticated: false });
  }

  try {
    console.log('Verifying token with secret:', env.jwtSecret);
    const decoded = jwt.verify(token, env.jwtSecret);
    console.log('Token verified successfully:', decoded);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ authenticated: false });
  }
};
