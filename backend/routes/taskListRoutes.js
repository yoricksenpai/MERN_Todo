import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'node:process';
const router = express.Router();
import Task, {TaskList} from '../models/taskModel.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 
import User from '../models/userModel.js';

// ROUTES CRUD ET AUTRES POUR LES LISTES DE TACHES
// Partager une liste de tâches
router.post('/:listId/share', authMiddleware, async (req, res) => {
  try {
    const { listId } = req.params;
    const { email, permissions } = req.body;

    const info = await new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    // Check if the user is the owner of the list
    const taskList = await TaskList.findOne({ _id: listId, owner: info.userId });
    if (!taskList) {
      return res.status(404).json({ message: 'Task list not found or you are not the owner' });
    }

    // Find the user to share with
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'User to share with not found' });
    }

    // Check if the list is already shared with this user
    const alreadyShared = taskList.sharedWith.some(share => share.user.toString() === userToShare._id.toString());
    if (alreadyShared) {
      return res.status(400).json({ message: 'List is already shared with this user' });
    }

    // Add the share
    taskList.sharedWith.push({ user: userToShare._id, permissions });
    await taskList.save();

    res.json({ message: 'Task list shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing task list', error: error.message });
  }
});

// Ajouter une tâche à une liste
router.post('/tasklist/:listId/task/:taskId', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        const { listId, taskId } = req.params;

        const taskList = await TaskList.findOne({
            $or: [
                { _id: listId, owner: info.userId },
                { _id: listId, 'sharedWith.user': info.userId, 'sharedWith.permissions': 'write' }
            ]
        });

        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to add tasks' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!taskList.tasks.includes(task._id)) {
            taskList.tasks.push(task._id);
            await taskList.save();
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error adding task to list:', error);
        res.status(500).json({ message: 'Error adding task to list', error: error.message });
    }
});

// Créer une nouvelle liste de tâches
router.post('/tasklist', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { name, description } = req.body;
        const newTaskList = new TaskList({
            name,
            description,
            owner: info.userId
        });
        await newTaskList.save();
        res.status(201).json(newTaskList);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task list', error });
    }
});

// Obtenir toutes les listes de tâches de l'utilisateur (y compris celles partagées avec lui)
router.get('/tasklists', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const ownedLists = await TaskList.find({ owner: info.userId });
        const sharedLists = await TaskList.find({ 'sharedWith.user': info.userId });
        res.json({ ownedLists, sharedLists });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task lists', error });
    }
});

//Mise a jour des permissions de partage
router.patch('/tasklist/:id/permissions', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { id } = req.params;
        const { userId, permissions } = req.body;
        const taskList = await TaskList.findOne({ _id: id, owner: info.userId });
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to modify it' });
        }
        
        const sharedUserIndex = taskList.sharedWith.findIndex(share => share.user.toString() === userId);
        if (sharedUserIndex === -1) {
            return res.status(404).json({ message: 'User not found in shared list' });
        }
        
        taskList.sharedWith[sharedUserIndex].permissions = permissions;
        await taskList.save();
        
        res.json({ message: 'Permissions updated successfully', taskList });
    } catch (error) {
        res.status(500).json({ message: 'Error updating permissions', error });
    }
});

// Modifier une liste de tâches
router.put('/tasklist/:id', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { id } = req.params;
        const { name, description } = req.body;
        const taskList = await TaskList.findOne({ _id: id, owner: info.userId });
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to modify it' });
        }
        
        taskList.name = name || taskList.name;
        taskList.description = description || taskList.description;
        
        await taskList.save();
        res.json({ message: 'Task list updated successfully', taskList });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task list', error });
    }
});

// Supprimer une liste de tâches
router.delete('/tasklist/:id', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { id } = req.params;
        const taskList = await TaskList.findOne({ _id: id, owner: info.userId });
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to delete it' });
        }
        
        // Supprimer toutes les tâches associées à cette liste
        await Task.deleteMany({ taskList: id });
        
        // Supprimer la liste elle-même
        await TaskList.findByIdAndDelete(id);
        
        res.json({ message: 'Task list and associated tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task list', error });
    }
});

// Retirer un utilisateur d'une liste partagée
router.post('/tasklist/:id/unshare', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { id } = req.params;
        const { userId } = req.body;
        const taskList = await TaskList.findOne({ _id: id, owner: info.userId });
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to modify sharing' });
        }
        
        taskList.sharedWith = taskList.sharedWith.filter(share => share.user.toString() !== userId);
        await taskList.save();
        
        res.json({ message: 'User removed from shared list successfully', taskList });
    } catch (error) {
        res.status(500).json({ message: 'Error removing user from shared list', error });
    }
});

router.delete('/:listId/tasks/:taskId', async (req, res) => {
  try {
    const { listId, taskId } = req.params;
    const taskList = await TaskList.findById(listId);
    if (!taskList) {
      return res.status(404).json({ message: 'Task list not found' });
    }
    
    taskList.tasks = taskList.tasks.filter(task => task.toString() !== taskId);
    await taskList.save();
    
    res.json({ message: 'Task removed from list successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing task from list', error: error.message });
  }
});


router.get('/tasklist/:listId/tasks', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { listId } = req.params;
        
        // Vérifier si l'utilisateur a le droit d'accéder à cette liste
        const taskList = await TaskList.findOne({
            _id: listId,
            $or: [
                { owner: info.userId },
                { 'sharedWith.user': info.userId }
            ]
        });
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to access it' });
        }
        
        // Récupérer les tâches de la liste
        const tasks = await Task.find({ _id: { $in: taskList.tasks } })
            .populate('category', 'name')
            .populate('author', 'username');
        
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks from list', error });
    }
});

export default router;