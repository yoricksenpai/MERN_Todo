import React, { useState, useEffect, ChangeEvent } from 'react';
import { Trash2, Edit2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleTaskNotifications, toggleTaskCompletion } from '../api/task';

// Définir l'interface pour une tâche
interface Task {
  _id: string;
  title: string;
  deadline: string;
  completed: boolean;
  notificationsEnabled: boolean;
  // Ajoutez d'autres propriétés si nécessaire
}

interface TaskComponentProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, onTaskUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [localTask, setLocalTask] = useState<Task>(task);

  // Mise à jour de la tâche locale lorsque la tâche passée en prop change
  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const handleEdit = () => {
    navigate(`/edit_task/${localTask._id}`);
  };

  const handleToggleNotification = async () => {
    const newNotificationState = !localTask.notificationsEnabled;
    setLocalTask(prevTask => ({ ...prevTask, notificationsEnabled: newNotificationState }));
    
    try {
      const updatedTask: Task = await toggleTaskNotifications(localTask._id, {});
      setLocalTask(updatedTask);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Erreur lors de la modification des notifications:', error);
      setLocalTask(prevTask => ({ ...prevTask, notificationsEnabled: !newNotificationState }));
      alert('Impossible de modifier les notifications. Veuillez réessayer.');
    }
  };

  const handleToggleCompletion = async () => {
    const newCompletionState = !localTask.completed;
    setLocalTask(prevTask => ({ ...prevTask, completed: newCompletionState }));
    
    try {
      const updatedTask: Task = await toggleTaskCompletion(localTask._id);
      setLocalTask(updatedTask);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Erreur lors de la modification du statut de complétion:', error);
      setLocalTask(prevTask => ({ ...prevTask, completed: !newCompletionState }));
      alert('Impossible de modifier le statut de la tâche. Veuillez réessayer.');
    }
  };

  const handleDelete = async () => {
    try {
      if (!localTask._id) {
        throw new Error('Task _id is undefined');
      }
      await onDelete(localTask._id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      alert('Impossible de supprimer la tâche. Veuillez réessayer.');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center mb-2 sm:mb-0">
        <input
          type="checkbox"
          checked={localTask.completed}
          onChange={handleToggleCompletion}
          className="mr-3 rounded border-gray-300 dark:border-gray-600"
        />
        <div>
          <h3 className={`font-medium ${localTask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}>
            {localTask.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Échéance : {formatDate(localTask.deadline)}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-2 sm:mt-0">
        <button
          onClick={handleToggleNotification}
          className={`mr-2 ${localTask.notificationsEnabled ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
          aria-label={localTask.notificationsEnabled ? "Désactiver les notifications" : "Activer les notifications"}
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={handleEdit}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
          aria-label="Modifier la tâche"
        >
          <Edit2 className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          aria-label="Supprimer la tâche"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskComponent;