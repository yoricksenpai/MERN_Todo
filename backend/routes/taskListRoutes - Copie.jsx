import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'node:process';
const router = express.Router();
import Task, {TaskList} from '../models/taskModel.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 

// ROUTES CRUD ET AUTRES POUR LES LISTES DE TACHES
// Partager une liste de tâches
router.post('/tasklist/:id/share', authMiddleware, async (req, res) => {
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
            return res.status(404).json({ message: 'Task list not found' });
        }
        taskList.sharedWith.push({ user: userId, permissions });
        await taskList.save();
        res.json({ message: 'Task list shared successfully', taskList });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing task list', error });
    }
});

// Ajouter une tâche à une liste
router.post('/tasklist/:id/task', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { id } = req.params;
        const { title, description, deadline, category } = req.body;
        const taskList = await TaskList.findOne({
            $or: [
                { _id: id, owner: info.userId },
                { _id: id, 'sharedWith.user': info.userId, 'sharedWith.permissions': 'write' }
            ]
        });
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to add tasks' });
        }
        const newTask = new Task({
            title,
            description,
            deadline,
            category,
            taskList: id
        });
        await newTask.save();
        taskList.tasks.push(newTask._id);
        await taskList.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task to list', error });
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

// Supprimer une tâche spécifique d'une liste
router.delete('/tasklist/:listId/task/:taskId', authMiddleware, async (req, res) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { listId, taskId } = req.params;
        
        // Vérifier si l'utilisateur a le droit de modifier cette liste
        const taskList = await TaskList.findOne({
            _id: listId,
            $or: [
                { owner: info.userId },
                { 'sharedWith.user': info.userId, 'sharedWith.permissions': 'write' }
            ]
        });
        
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found or you do not have permission to modify it' });
        }
        
        // Vérifier si la tâche existe et appartient à cette liste
        const task = await Task.findOne({ _id: taskId, taskList: listId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found in this list' });
        }
        
        // Supprimer la tâche
        await Task.findByIdAndDelete(taskId);
        
        // Retirer la référence de la tâche de la liste
        taskList.tasks = taskList.tasks.filter(task => task.toString() !== taskId);
        await taskList.save();
        
        res.json({ message: 'Task deleted successfully from the list' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task from list', error });
    }
});

export default router;