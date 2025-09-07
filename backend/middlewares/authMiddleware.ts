import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import { env } from 'node:process';
import { AuthRequest } from '../types/index.js';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    if (!env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);  // Changé de id à userId
    if (!user) {
      res.status(401).json({ message: 'User not found: ' + decoded.userId });
      return;
    }
    req.user = {
      id: user._id,
      username: user.username,
    };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
export default authMiddleware;