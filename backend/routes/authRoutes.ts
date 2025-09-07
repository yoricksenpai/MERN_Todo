import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { env } from 'node:process';
import { notificationService } from '../utils/notificationService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validateUserData } from '../middlewares/validation.js';
import { AuthRequest } from '../types/index.js'; 

const router = express.Router();


// Route pour obtenir les notifications de l'utilisateur
router.get('/notifications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
      const info = await new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
        const userId = info.userId; // Assurez-vous que votre middleware d'authentification ajoute l'ID de l'utilisateur à req.user
        const notifications = await notificationService.getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Route pour marquer une notification comme lue
router.post('/:notificationId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const info = await new Promise((resolve, reject) => {
          jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
          });
        });
        const userId = info.userId;        const { notificationId } = req.params;
        await notificationService.markNotificationAsRead(userId, notificationId);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
});


// Register and Login
router.post('/register', validateUserData, async (req: Request, res: Response) => {
    try {
        const { email, password,username } = req.body;
        const user = new User({ email, password, username });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/login', async (req: Request, res: Response) => {
    try {
        const { password, username } = req.body;
        console.log('Login attempt for username:', username);
        
        const userDoc = await User.findOne({ username });
        console.log('User found:', userDoc ? 'Yes' : 'No');
        
        if (!userDoc || !(await userDoc.comparePassword(password))) {
            console.log('Invalid credentials for user:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: userDoc._id }, env.JWT_SECRET);
        console.log('Token generated for user:', username);
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 heures
        }).json({
            id: userDoc._id,
            username: userDoc.username,
        });
        console.log('Login successful for user:', username);
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
});

router.get("/profile", async (req: Request, res: Response) => {
  const { token } = req.cookies;
  console.log('Profile request - cookies:', req.cookies);
  console.log('Profile request - token:', token ? 'present' : 'missing');
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const user = await User.findById(info.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Error in /profile route:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Log out
router.post('/logout', (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(0)
    }).json('ok');
})

export default router;