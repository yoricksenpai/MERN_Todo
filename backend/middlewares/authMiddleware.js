import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {env} from 'node:process';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  console.log('Received token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded.userId);  // Changé de id à userId
    if (!user) {
      return res.status(401).json({ message: 'User not found: ' + decoded.userId });
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