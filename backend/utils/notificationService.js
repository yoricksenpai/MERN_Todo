// services/notificationService.js

import webpush from 'web-push';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js';
import Notification from '../models/notificationsModel.js';
import dotenv from 'dotenv';

dotenv.config();

webpush.setVapidDetails(
  'mailto:johanpriso10@gmail.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export const notificationService = {
  async saveSubscription(userId, subscription) {
    try {
      await User.findByIdAndUpdate(userId, { pushSubscription: subscription });
      return { success: true, message: 'Subscription saved successfully' };
    } catch (error) {
      console.error('Error saving subscription:', error);
      return { success: false, message: 'Failed to save subscription' };
    }
  },

  async sendNotificationToUser(userId, title, body, type = 'other') {
    try {
      const user = await User.findById(userId);
      if (!user || !user.pushSubscription) {
        return { success: false, message: 'User not found or not subscribed' };
      }

      const payload = JSON.stringify({ title, body });
      await webpush.sendNotification(user.pushSubscription, payload);

      // Créer une nouvelle notification dans la base de données
      await Notification.create({
        userId,
        message: body,
        type
      });

      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, message: 'Failed to send notification' };
    }
  },

  async sendTaskNotification(taskId) {
    try {
      const task = await Task.findById(taskId).populate('author');
      if (!task) {
        return { success: false, message: 'Task not found' };
      }

      const title = 'Rappel de tâche';
      const body = `La tâche "${task.title}" arrive à échéance bientôt.`;
      return await this.sendNotificationToUser(task.author._id, title, body, 'task_reminder');
    } catch (error) {
      console.error('Error sending task notification:', error);
      return { success: false, message: 'Failed to send task notification' };
    }
  },

  async checkAndSendTaskNotifications() {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const tasksToNotify = await Task.find({
        deadline: { $gt: now, $lte: twentyFourHoursLater },
        completed: false
      }).populate('author');

      for (let task of tasksToNotify) {
        await this.sendTaskNotification(task._id);
      }

      return { success: true, message: 'Task notifications checked and sent' };
    } catch (error) {
      console.error('Error checking and sending task notifications:', error);
      return { success: false, message: 'Failed to check and send task notifications' };
    }
  },

  async getUserNotifications(userId) {
    try {
      const notifications = await Notification.find({ userId, isRead: false })
        .sort({ createdAt: -1 })
        .limit(10);  // Limite à 10 notifications non lues les plus récentes

      return notifications.map(notification => ({
        id: notification._id,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt
      }));
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  },

  async markNotificationAsRead(userId, notificationId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId: userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found or does not belong to the user');
      }

      return { success: true, message: 'Notification marked as read' };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async deleteOldNotifications() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
      console.log('Old notifications deleted successfully');
    } catch (error) {
      console.error('Error deleting old notifications:', error);
    }
  }
};

export default notificationService;