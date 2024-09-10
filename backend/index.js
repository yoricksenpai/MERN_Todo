import express from 'express';
import { env } from 'node:process';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import taskListRoutes from './routes/taskListRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import initScheduledTasks from './schedulers/reminderScheduler.js';
import connectDB from './config/dbConfig.js';

connectDB();

const app = express();

const isProd = env.NODE_ENV === 'production';

// Middleware CORS personnalisé
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Routes avec CORS appliqué
const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};

app.use(allowCors((req, res) => {
  // Vous pouvez gérer vos routes ici
  res.send("Hello World!"); // Exemple de réponse
}));

// Autres middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', allowCors(authRoutes));
app.use('/tasks', allowCors(taskRoutes));
app.use('/cat', allowCors(categoryRoutes));
app.use('/tl', allowCors(taskListRoutes));

// Initialiser les tâches planifiées
initScheduledTasks();

// Démarrer le serveur
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});