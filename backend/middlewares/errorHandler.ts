import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Données invalides',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID invalide'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Cette donnée existe déjà'
    });
  }

  res.status(500).json({
    message: 'Erreur serveur interne'
  });
};