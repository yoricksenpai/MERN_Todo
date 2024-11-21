import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'node:process';
const router = express.Router();
import Task, {TaskList} from '../models/taskModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import notificationService from '../utils/notificationService.js';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';
//ROUTES CRUD Tâches ainsi que Routes recupérations
// Definir une route pour la creation d'une tâche
router.post('/create_task', authMiddleware, async (req, res) => {
    try {
        const { token } = req.cookies;

        const info = await new Promise((resolve, reject) => {
            jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        const { title, description, deadline, category } = req.body;

        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Vérifier si la catégorie existe
        const categoryExists = await Category.findOne({ _id: category, author: info.userId });
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newTask = new Task({
            title,
            description,
            deadline,
            category,
            author: info.userId,
            completed: false
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);

    } catch(error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

// Definir une route pour la recuperation de toutes les 20 plus recentes tâches
router.get('/tasks_twenty', authMiddleware, async (req, res) => {
      const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
  res.json(
      await Task.find({ author: info.userId })
          .populate('author', ['username'])
          .sort({createdAt: -1})
          .limit(20)
  );
});

// Definir une route pour la recuperation de toutes les tâches
router.get('/tasks', authMiddleware, async (req, res) => {
    try {
        const { token } = req.cookies;
       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
     res.json(
      await Task.find({ author: info.userId })
          .populate('author', ['username'])
          .sort({createdAt: -1})
  );   
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
  
});


// Definir une route pour la recuperation d'une tâche
router.get("/task/:id", authMiddleware, async (req, res) => {
        console.log("Backend received request for task ID:", req.params.id);
    const { id } = req.params;
      const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
  const taskDoc = await Task.findById({_id: id, author: info.userId}).populate("author", ["username"]);
  res.json(taskDoc);
});

router.delete('/task/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;

    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
    
    console.log('User info:', info); // Log user info

    const taskDoc = await Task.findOne({_id: id, author: info.userId});
    console.log('Task found:', taskDoc); // Log found task

    if (!taskDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (taskDoc.author.toString() !== info.userId) {
      return res.status(403).json({ message: 'You are not the author of this task'  });
    }
    
    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Definir une route de recupération d'information d'une tâche avec les informations de l'auteur
router.get("/task/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
      const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
  const taskDoc = await Task.findById({_id: id, author: info.userId}).populate("author", ["username"]);
  res.json(taskDoc);
});

// Définir une route pour la mise à jour d'une tâche existante
router.put('/task/:id', authMiddleware, async (req, res) => {
     try {
         const { id } = req.params;
           const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
         const { title, description, deadline, category } = req.body;
       const updatedTask = await Task.findByIdAndUpdate({_id: id, author: info.userId}, { title, description, deadline, category }, { new: true });
         res.json(updatedTask);

     } catch (error) {
         console.error('Error updating post:', error);
         res.status(500).json({ message: 'Error updating post' });
     }
});




//ROUTES SPECIFIQUES
 // Route pour marquer une tâche comme complétée ou non complétée
router.patch('/task/:id/toggle-completion', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const { token } = req.cookies;

        const info = await new Promise((resolve, reject) => {
            jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        const task = await Task.findOne({ _id: id, author: info.userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.completed = !task.completed;
        const updatedTask = await task.save();
        // Envoyer une notification en temps réel
        res.json(updatedTask);
    } catch (error) {
        console.error('Error toggling task completion:', error);
        res.status(500).json({ message: 'Error updating task completion status' });
    }
});

// Route pour activer/désactiver les notifications pour une tâche spécifique
// Route pour activer/désactiver les notifications pour une tâche spécifique
router.patch('/task/:id/toggle-notifications', authMiddleware, async (req, res) => {
  try {
      const { id } = req.params;
      const { token } = req.cookies;
      const info = await new Promise((resolve, reject) => {
          jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded);
          });
      });
      const task = await Task.findOne({ _id: id, author: info.userId });

      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      task.notificationsEnabled = !task.notificationsEnabled;
      const updatedTask = await task.save();

      // Si les notifications sont activées, nous pourrions vouloir envoyer une notification
      if (task.notificationsEnabled) {
          const notification = new Notification({
              userId: info.userId,
              message: `Les notifications pour la tâche "${task.title}" ont été activées.`,
              type: 'task_reminder'
          });
          await notification.save();

          // Ici, vous pouvez utiliser votre service de notification pour envoyer une notification en temps réel
          await notificationService.sendNotification(info.userId, notification);
      }

      res.json(updatedTask);
  } catch (error) {
      console.error('Error toggling task notifications:', error);
      res.status(500).json({ message: 'Error updating task notification settings' });
  }
});



 // ROUTES POUR LES FILTRAGES
 // Route pour filtrer les tâches par catégorie
// Dans taskRoutes.jsx




// Route pour obtenir les tâches filtrées par catégorie
router.get('/by-category/:categoryId', authMiddleware, async (req, res) => {
  try {
    const { categoryId } = req.params;
          const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });    const tasks = await Task.find({ category: categoryId, author: info.userId })
      .populate('category', 'name')
      .sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches", error: error.message });
  }
});


router.get('/tasklist/:id/tasks', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

          const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
        const taskList = await TaskList.findOne({
            _id: id,
            $or: [
                { owner: info.userId },
                { 'sharedWith.user': info.userId }
            ]
        }).populate('tasks');
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to view it' });
        }
        
        res.json(taskList.tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks from list', error });
    }
});

// Route pour trier les tâches par date d'échéance
router.get('/tasks/sort/deadline', authMiddleware, async (req, res) => {
    try {
          const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
        const tasks = await Task.find({ author: info.userId })
            .populate('author', ['username'])
            .sort({ deadline: 1 }); // 1 pour ordre croissant, -1 pour ordre décroissant
        res.json(tasks);
    } catch (error) {
        console.error('Error sorting tasks by deadline:', error);
        res.status(500).json({ message: 'Error sorting tasks' });
    }
});

// Route pour trier les tâches par ordre alphabétique du titre
router.get('/tasks/sort/alphabetical', authMiddleware, async (req, res) => {
    try {
          const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
        const tasks = await Task.find({ author: info.userId })
            .populate('author', ['username'])
            .sort({ title: 1 }); // 1 pour ordre croissant (A-Z), -1 pour ordre décroissant (Z-A)
        res.json(tasks);
    } catch (error) {
        console.error('Error sorting tasks alphabetically:', error);
        res.status(500).json({ message: 'Error sorting tasks' });
    }
});

// Route pour filtrer les tâches par statut (terminées ou non)
router.get('/tasks/status/:completed', authMiddleware, async (req, res) => {
    try {
          const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
        const { completed } = req.params;
        const tasks = await Task.find({ 
            author: info.userId,
            completed: completed === 'true'
        })
        .populate('author', ['username'])
        .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error filtering tasks by status:', error);
        res.status(500).json({ message: 'Error filtering tasks' });
    }
});

export default router;