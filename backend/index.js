import express from 'express';
import { env } from 'node:process';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import taskListRoutes from './routes/taskListRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import initScheduledTasks from './schedulers/reminderScheduler.js';
import connectDB from './config/dbConfig.js';

connectDB();

const app = express();

const isProd = env.NODE_ENV === 'production';

// Configuration CORS améliorée
const corsOptions = {
  origin: isProd 
    ? ['https://mern-todo-iota-six.vercel.app', 'https://mern-todo-backend-nine-sigma.vercel.app']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Application du middleware CORS avant les autres middlewares
app.use(cors(corsOptions));

// Autres middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/cat', categoryRoutes);
app.use('/tl', taskListRoutes);

// Initialiser les tâches planifiées
initScheduledTasks();

// Démarrer le serveur
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
