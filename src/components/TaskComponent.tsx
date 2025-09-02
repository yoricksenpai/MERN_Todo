import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Bell, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleTaskNotifications, toggleTaskCompletion } from '../api/task';
import { showError } from '../utils/toast';
import { Task } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

// Helper to convert VAPID public key (base64) to Uint8Array required by PushManager
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

interface TaskComponentProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [localTask, setLocalTask] = useState<Task>(task);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement des notifications

  // Mise à jour de la tâche locale lorsque la tâche passée en prop change
  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const handleEdit = () => {
    if (!localTask._id) {
      console.error('Task ID is undefined');
      return;
    }
    navigate(`/edit_task/${localTask._id}`);
  };

  const handleToggleNotification = async () => {
    if (!localTask._id) {
      console.error('Task ID is undefined');
      return;
    }

    // Désactiver l'interface en attendant la réponse
    setLoading(true);

    const newNotificationState = !localTask.notificationsEnabled;
    setLocalTask(prevTask => ({ ...prevTask, notificationsEnabled: newNotificationState }));

    try {
      // Récupération de la subscription du service worker
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      // Si aucune subscription, demander la permission et s'abonner automatiquement
      if (!subscription) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setLocalTask(prevTask => ({ ...prevTask, notificationsEnabled: !newNotificationState }));
          showError('Permission de notifications refusée');
          setLoading(false);
          return;
        }

        const vapidPublicKey = (import.meta as any).env?.VITE_PUBLIC_VAPID_KEY as string | undefined;
        if (!vapidPublicKey) {
          console.error('Missing VAPID public key (VITE_PUBLIC_VAPID_KEY)');
          setLocalTask(prevTask => ({ ...prevTask, notificationsEnabled: !newNotificationState }));
          showError('Configuration des notifications manquante');
          setLoading(false);
          return;
        }

        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
      }

      // Appeler la fonction pour activer/désactiver les notifications
      const updatedTask: Task = await toggleTaskNotifications(localTask._id, subscription);
      setLocalTask(updatedTask);
      onUpdate(updatedTask);
    } catch (error) {
      console.error('Erreur lors de la modification des notifications:', error);
      setLocalTask(prevTask => ({ ...prevTask, notificationsEnabled: !newNotificationState }));
      showError('Impossible de modifier les notifications');
    } finally {
      setLoading(false); // Réactiver l'interface après la réponse
    }
  };

  const handleToggleCompletion = async () => {
    if (!localTask._id) {
      console.error('Task ID is undefined');
      return;
    }

    setLoading(true); // Activer le chargement pour la modification

    const newCompletionState = !localTask.completed;
    setLocalTask(prevTask => ({ ...prevTask, completed: newCompletionState }));

    try {
      const updatedTask: Task = await toggleTaskCompletion(localTask._id);
      setLocalTask(updatedTask);
      if (typeof onUpdate === 'function') {
        onUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut de complétion:', error);
      setLocalTask(prevTask => ({ ...prevTask, completed: !newCompletionState }));
      showError('Impossible de modifier le statut de la tâche');
    } finally {
      setLoading(false); // Réactiver l'interface après la réponse
    }
  };

  const handleDelete = async () => {
    if (!localTask._id) {
      console.error('Task ID is undefined');
      return;
    }

    try {
      await onDelete(localTask._id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      showError('Impossible de supprimer la tâche');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card hover className="p-3 sm:p-4 lg:p-6 animate-fadeIn h-full flex flex-col">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <button
          onClick={handleToggleCompletion}
          className={`transition-colors ${
            localTask.completed 
              ? 'text-emerald-600' 
              : 'text-slate-400 hover:text-emerald-600'
          }`}
          disabled={loading}
        >
          <CheckCircle2 className={`h-5 w-5 lg:h-6 lg:w-6 ${
            localTask.completed ? 'fill-current' : ''
          }`} />
        </button>
        
        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleNotification}
            loading={loading}
            className={localTask.notificationsEnabled ? 'text-amber-600' : 'text-slate-400'}
          >
            <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-blue-600"
          >
            <Edit2 className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600"
          >
            <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className={`font-semibold text-base lg:text-lg mb-3 transition-all line-clamp-2 ${
          localTask.completed 
            ? 'line-through text-slate-500 dark:text-slate-400' 
            : 'text-slate-900 dark:text-white'
        }`}>
          {localTask.title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs lg:text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
            <span>{formatDate(localTask.deadline)}</span>
          </div>
          
          {localTask.notificationsEnabled && (
            <div className="flex items-center text-xs lg:text-sm text-amber-600">
              <Bell className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              <span>Notifications</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskComponent;
