import express from 'express';
import { env } from 'node:process';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import taskListRoutes from './routes/taskListRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import initScheduledTasks from './schedulers/reminderScheduler.js';
import connectDB from './config/dbConfig.js'
import nodemailer from 'nodemailer';
import cors from 'cors';
connectDB();

const app = express();

// Middleware pour parser le JSON dans le corps des requêtes
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // L'URL de votre frontend Vite
  credentials: true
}));


// Middleware pour parser les cookies
app.use(cookieParser());

// Autres configurations de votre application...

// Utiliser les routes d'authentification
app.use('/auth', authRoutes);

//Utiliser les routes pour les tâches
app.use('/tasks', taskRoutes);

//Utiliser les routes pour les categories
app.use('/cat', categoryRoutes);

//Utiliser les routes pour les listes de tâches
app.use('/tl', taskListRoutes);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Utilisation du service Gmail
  auth: {
    user: 'iwomirecovery@gmail.com', // Votre adresse email
    pass: 'yxqn mmah lyju fojw' // Votre mot de passe (vous devrez le remplacer)
  }
});
 
// Initialiser les tâches planifiées
initScheduledTasks();

// Démarrer le serveur
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
