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

async function deleteOldNotifications() {
  console.log('Suppression des anciennes notifications...');
  try {
    await notificationService.deleteOldNotifications();
    console.log('Anciennes notifications supprimées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression des anciennes notifications:', error);
  }
}


// Configurer les tâches planifiées
function setupScheduledTasks() {
  // Vérifier les tâches toutes les heures
  cron.schedule('0 * * * *', checkAndNotifyTasks);

    // Supprimer les notifications anciennes tous les jours à minuit
    cron.schedule('0 0 * * *', deleteOldNotifications);
  // Vous pouvez ajouter d'autres tâches planifiées ici si nécessaire
}

// Fonction d'initialisation à exporter
export default function initScheduledTasks() {
  console.log('Initialisation des tâches planifiées...');
  setupScheduledTasks();
  console.log('Tâches planifiées initialisées avec succès.');
}