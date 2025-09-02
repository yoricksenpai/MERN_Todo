import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchNotifications, dismissNotification } from '../api/auth';

interface Notification {
  id?: string;
  _id?: string;
  type: string;
  message: string;
}

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'task_reminder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'system_message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4 mb-4">
      <div className="flex items-start gap-4">
        <span className="text-blue-600">
          {getIcon(notification.type)}
        </span>

        <div className="flex-1">
          <strong className="block font-medium text-gray-900">
            {notification.type === 'task_reminder' ? 'Rappel de tâche' : 'Notification'}
          </strong>
          <p className="mt-1 text-sm text-gray-700">{notification.message}</p>
        </div>

        <button onClick={() => onDismiss(notification.id || notification._id || '')} className="text-gray-500 transition hover:text-gray-600">
          <span className="sr-only">Dismiss notification</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setError(null); // Ne pas afficher d'erreur pour les notifications
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      await dismissNotification(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
      setError('Failed to dismiss notification. Please try again.');
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (error || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm space-y-2 z-50">
      {notifications.slice(0, 3).map(notification => (
        <NotificationItem 
          key={notification.id || notification._id} 
          notification={notification} 
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default NotificationList;