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

app.use('/mail',async (req, res) => {
    try {
        const { email } = req.body;
        const mailOptions = {
      from: 'iwomirecovery@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n
             Please click on the following link, or paste it into your browser to complete the process:\n\n
             $test\n\n
             If you did not request this, please ignore this email and your password will remain unchanged. This link will expires in 1h\n`
    };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
  
// Autres configurations de votre application...
 
// Initialiser les tâches planifiées
initScheduledTasks();

// Démarrer le serveur
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});