import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'ID invalide' });
    return;
  }
  next();
};

export const validateTaskData = (req: Request, res: Response, next: NextFunction): void => {
  const { title, deadline, category } = req.body;
  
  if (!title || title.trim().length === 0) {
    res.status(400).json({ message: 'Le titre est requis' });
    return;
  }
  
  if (!deadline || isNaN(Date.parse(deadline))) {
    res.status(400).json({ message: 'Date d\'échéance invalide' });
    return;
  }
  
  if (!category || !mongoose.Types.ObjectId.isValid(category)) {
    res.status(400).json({ message: 'Catégorie invalide' });
    return;
  }
  
  next();
};

export const validateUserData = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, password } = req.body;
  
  if (!username || username.trim().length < 3) {
    res.status(400).json({ message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' });
    return;
  }
  
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    res.status(400).json({ message: 'Email invalide' });
    return;
  }
  
  if (!password || password.length < 6) {
    res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    return;
  }
  
  next();
};