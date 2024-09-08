/* eslint-disable react/prop-types */
import { Trash2, Edit2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleTaskNotifications, toggleTaskCompletion } from '../api/task';

const TaskComponent = ({ task, onTaskUpdate, onDelete }) => {
  const navigate = useNavigate();

 // Utilisation de la déstructuration pour extraire les propriétés de la tâche
  const { _id, title, deadline, completed, notificationsEnabled } = task;

  const handleEdit = () => {
    navigate(`/edit_task/${_id}`);
  };

  const handleToggleNotification = async () => {
    try {
      const updatedTask = await toggleTaskNotifications(_id);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Erreur lors de la modification des notifications:', error);
      alert('Impossible de modifier les notifications. Veuillez réessayer.');
    }
  };
const handleDelete = async () => {
  try {
    if (!_id) {
      throw new Error('Task _id is undefined');
    }
    await onDelete(_id);
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    alert('Impossible de supprimer la tâche. Veuillez réessayer.');
  }
};

  const handleToggleCompletion = async () => {
    try {
      if (!_id) {
        throw new Error('Task _id is undefined');
      }
      const updatedTask = await toggleTaskCompletion(_id);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Erreur lors de la modification du statut de complétion:', error);
      alert('Impossible de modifier le statut de la tâche. Veuillez réessayer.');
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center mb-2 sm:mb-0">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleCompletion}
          className="mr-3 rounded border-gray-300 dark:border-gray-600"
        />
        <div>
          <h3 className={`font-medium ${completed ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Échéance : {formatDate(deadline)}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-2 sm:mt-0">
        <button
          onClick={handleToggleNotification}
          className={`mr-2 ${notificationsEnabled ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
          aria-label={notificationsEnabled ? "Désactiver les notifications" : "Activer les notifications"}
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
          onClick= {handleDelete}
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