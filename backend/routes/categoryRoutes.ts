import express, { Request, Response } from 'express';
import Category from '../models/categoryModel.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';
import jwt from 'jsonwebtoken';
import { env } from 'node:process';
import { AuthRequest } from '../types/index.ts';

const router = express.Router();

// Définir une route pour ajouter une catégorie
router.post('/category', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { token } = req.cookies;

  const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
  const {name} = req.body;

    const categoryDoc = await Category.create({
        name,
        author: info.userId
    });
  
      res.json(categoryDoc);


});

// Définir une route pour trouver une catégorie par son ID
router.get('/category/:categoryId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.params;
      const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
    const category = await Category.findById({_id:categoryId, author: info.userId});
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Définir une route pour trouver une catégorie
router.get('/category', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
      const { token } = req.cookies;

       const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
  });
    const categories = await Category.find({ author: info.userId });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Définir une route pour supprimer des categories
// Supprimer une catégorie
router.delete('/category/:categoryId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const info = await new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, env.JWT_SECRET, {}, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        const { categoryId } = req.params;
        const category = await Category.findOne({ _id: categoryId, author: info.userId });
        
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée ou vous n\'avez pas la permission de la supprimer' });
        }
        
        await Category.deleteOne({ _id: categoryId });
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error });
    }
});

export default router;