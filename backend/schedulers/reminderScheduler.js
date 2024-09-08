// scheduledTasks.js

import cron from 'node-cron';
import notificationService from '../utils/notificationService.js';

// Fonction pour vérifier et envoyer les notifications des tâches
async function checkAndNotifyTasks() {
  console.log('Vérification des tâches à notifier...');
  try {
    const result = await notificationService.checkAndSendTaskNotifications();
    console.log('Résultat de la vérification:', result.message);
  } catch (error) {
    console.error('Erreur lors de la vérification des tâches:', error);
  }
}

// Configurer les tâches planifiées
function setupScheduledTasks() {
  // Vérifier les tâches toutes les heures
  cron.schedule('0 * * * *', checkAndNotifyTasks);

  // Vous pouvez ajouter d'autres tâches planifiées ici si nécessaire
}

// Fonction d'initialisation à exporter
export default function initScheduledTasks() {
  console.log('Initialisation des tâches planifiées...');
  setupScheduledTasks();
  console.log('Tâches planifiées initialisées avec succès.');
}