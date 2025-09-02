import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'node:process';
const router = express.Router();
import Task, { TaskList } from '../models/taskModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import Category from '../models/categoryModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import { validateObjectId, validateTaskData } from '../middlewares/validation.js';
import { AuthRequest } from '../types/index.js';
import { notificationService } from '../utils/notificationService.js';

// ROUTES CRUD Tâches
// Route pour la création d'une tâche
router.post('/create_task', authMiddleware, validateTaskData, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const { title, description, deadline, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const categoryExists = await Category.findOne({ _id: category, author: (info as any).userId });
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const newTask = new Task({
      title,
      description,
      deadline,
      category,
      author: (info as any).userId,
      completed: false,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Route pour récupérer les 20 tâches les plus récentes
router.get('/tasks_twenty', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const tasks = await Task.find({ author: (info as any).userId })
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Route pour récupérer toutes les tâches
router.get('/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const tasks = await Task.find({ author: (info as any).userId })
      .populate('author', ['username'])
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Route pour récupérer une tâche spécifique
router.get('/task/:id', authMiddleware, validateObjectId, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const taskDoc = await Task.findOne({ _id: id, author: (info as any).userId }).populate('author', ['username']);

    if (!taskDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(taskDoc);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Route pour supprimer une tâche
router.delete('/task/:id', authMiddleware, validateObjectId, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const taskDoc = await Task.findOne({ _id: id, author: (info as any).userId });

    if (!taskDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (taskDoc.author.toString() !== (info as any).userId) {
      return res.status(403).json({ message: 'You are not the author of this task' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour mettre à jour une tâche
router.put('/task/:id', authMiddleware, validateObjectId, validateTaskData, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const { title, description, deadline, category } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, author: (info as any).userId },
      { title, description, deadline, category },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// ROUTES SPÉCIFIQUES
// Route pour marquer une tâche comme complétée ou non complétée
router.patch('/task/:id/toggle-completion', authMiddleware, validateObjectId, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const task = await Task.findOne({ _id: id, author: (info as any).userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ message: 'Error updating task completion status' });
  }
});

// Route pour activer/désactiver les notifications pour une tâche
router.patch('/task/:id/toggle-notifications', authMiddleware, validateObjectId, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subscription } = req.body; // optionnel si désactivation
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const task = await Task.findOne({ _id: id, author: (info as any).userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const willEnable = !task.notificationsEnabled;

    // Si on active les notifications, valider et enregistrer la subscription utilisateur
    if (willEnable) {
      if (!subscription || typeof subscription !== 'object' || !subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
        return res.status(400).json({ message: 'Invalid subscription object' });
      }

      const user = await User.findById((info as any).userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.pushSubscription = subscription;
      await user.save();

      // Essayer d'envoyer une notification d'activation (non bloquant)
      try {
        await notificationService.sendNotificationToUser(
          (info as any).userId as string,
          'Notifications activées',
          `Les notifications pour la tâche "${task.title}" ont été activées.`,
          `/tasks/${task._id}`
        );
      } catch (e) {
        console.warn('Non-blocking push send failed:', e);
      }
    }

    // Appliquer et sauvegarder le nouvel état
    task.notificationsEnabled = willEnable;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Error toggling notifications:', error);
    res.status(500).json({ message: 'Error updating notification settings' });
  }
});

// Route pour trier les tâches par date d'échéance
router.get('/tasks/sort/deadline', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).json({ message: 'JWT secret not configured' });

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const tasks = await Task.find({ author: (info as any).userId })
      .populate('author', ['username'])
      .sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error sorting tasks by deadline:', error);
    res.status(500).json({ message: 'Error sorting tasks' });
  }
});

// Route pour trier les tâches par ordre alphabétique du titre
router.get('/tasks/sort/alphabetical', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).json({ message: 'JWT secret not configured' });

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const tasks = await Task.find({ author: (info as any).userId })
      .populate('author', ['username'])
      .sort({ title: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error sorting tasks alphabetically:', error);
    res.status(500).json({ message: 'Error sorting tasks' });
  }
});

// Route pour filtrer les tâches par statut (terminées ou non)
router.get('/tasks/status/:completed', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).json({ message: 'JWT secret not configured' });

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const { completed } = req.params;
    const tasks = await Task.find({ author: (info as any).userId, completed: completed === 'true' })
      .populate('author', ['username'])
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error filtering tasks by status:', error);
    res.status(500).json({ message: 'Error filtering tasks' });
  }
});

// Route pour obtenir les tâches filtrées par catégorie
router.get('/by-category/:categoryId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).json({ message: 'JWT secret not configured' });

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const { categoryId } = req.params;
    const tasks = await Task.find({ category: categoryId, author: (info as any).userId })
      .populate('category', 'name')
      .sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by category:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Route pour récupérer les tâches d'une liste
router.get('/tasklist/:id/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const jwtSecret = env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).json({ message: 'JWT secret not configured' });

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const taskList = await TaskList.findOne({
      _id: id,
      $or: [
        { owner: (info as any).userId },
        { 'sharedWith.user': (info as any).userId }
      ]
    }).populate('tasks');

    if (!taskList) {
      return res.status(404).json({ message: 'Task list not found or you do not have permission to view it' });
    }

    res.json(taskList.tasks);
  } catch (error) {
    console.error('Error fetching tasks from list:', error);
    res.status(500).json({ message: 'Error fetching tasks from list' });
  }
});

export default router;
