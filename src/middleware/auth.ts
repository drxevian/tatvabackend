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
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
}; 