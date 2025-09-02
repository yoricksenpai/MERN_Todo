import express, { Application } from 'express';
import { env } from 'node:process';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import taskListRoutes from './routes/taskListRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import initScheduledTasks from './schedulers/reminderScheduler.js';
import connectDB from './config/dbConfig.js';
import { errorHandler } from './middlewares/errorHandler.js';

connectDB();

const app: Application = express();


// Configuration CORS améliorée
const allowedOrigins = [
  'http://localhost:5173', 
  'https://mern-todo-iota-six.vercel.app', 
  'https://mern-todo-chi-gold.vercel.app',
  'https://mern-todo-backend-psi.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// Autres middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/cat', categoryRoutes);
app.use('/tl', taskListRoutes);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

// Initialiser les tâches planifiées
initScheduledTasks();

// Démarrer le serveur
const PORT: string | number = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

//love