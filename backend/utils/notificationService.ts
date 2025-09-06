// services/notificationService.js

import webpush from 'web-push';
import User from '../models/userModel.ts';
import Task from '../models/taskModel.ts';
import Notification from '../models/notificationsModel.ts';
import dotenv from 'dotenv';
dotenv.config();

// Configuration VAPID seulement si les clés sont présentes
if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    'mailto:johanpriso10@gmail.com',
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
  );
} else {
  console.warn('VAPID keys not configured - push notifications disabled');
}

export const notificationService = {
  /**
   * Enregistrer une subscription Web Push pour un utilisateur
   */
  async saveSubscription(userId: string, subscription: any) {
    try {
      if (!subscription?.endpoint || !subscription?.keys) {
        throw new Error('Invalid subscription object');
      }

      const user = await User.findByIdAndUpdate(userId, { pushSubscription: subscription });
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, message: 'Subscription saved successfully' };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la subscription:', error);
      return { success: false, message: 'Failed to save subscription' };
    }
  },

  /**
   * Envoyer une notification push à un utilisateur spécifique
   */
  async sendNotificationToUser(userId: string, title: string, body: string, url = '/') {
    try {
      const user = await User.findById(userId);
      if (!user || !user.pushSubscription) {
        return { success: false, message: 'User not found or not subscribed' };
      }

      const payload = JSON.stringify({ title, body, url });
      await webpush.sendNotification(user.pushSubscription, payload);

      console.log('Notification envoyée avec succès à l\'utilisateur:', userId);
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return { success: false, message: 'Failed to send notification' };
    }
  },

  /**
   * Vérifier les tâches et envoyer des notifications pour celles proches de l'expiration
   */
  async checkAndSendTaskNotifications(): Promise<{success: boolean, message: string}> {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const tasksToNotify = await Task.find({
        deadline: { $gt: now, $lte: twentyFourHoursLater },
        completed: false,
        notificationsEnabled: true,
      }).populate('author');

      for (const task of tasksToNotify) {
        await this.sendNotificationToUser(
          (task.author as any)._id.toString(),
          'Rappel de tâche',
          `Votre tâche "${task.title}" arrive à échéance.`,
          `/tasks/${task._id}`
        );
      }

      return { success: true, message: 'Task notifications checked and sent' };
    } catch (error) {
      console.error('Erreur lors de la vérification et de l\'envoi des notifications:', error);
      return { success: false, message: 'Failed to check and send notifications' };
    }
  },

  /**
   * Récupérer les notifications d'un utilisateur
   */
  async getUserNotifications(userId: string) {
    try {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      return { success: true, notifications };
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return { success: false, message: 'Failed to get notifications' };
    }
  },

  /**
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(userId: string, notificationId: string) {
    try {
      await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true }
      );
      return { success: true, message: 'Notification marked as read' };
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      return { success: false, message: 'Failed to mark notification as read' };
    }
  },

  /**
   * Supprimer les anciennes notifications de la base de données
   */
  async deleteOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
      console.log('Anciennes notifications supprimées avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression des anciennes notifications:', error);
    }
  },
};