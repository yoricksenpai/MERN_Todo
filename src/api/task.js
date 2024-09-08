const API_URL =  '/api'; // Utilise le proxy de Vite

/**
 * A utility function to handle JSON responses from the server, and throw
 * errors if the response was not OK.
 *
 * @param {Response} response - The response to handle.
 *
 * @returns {Promise<Object>} The resolved JSON data.
 *
 * @throws {Error} If the response was not OK.
 */



const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw data.error || response.statusText;
  }
  return data;
};

/**
 * Cr e une nouvelle t che sur le serveur.
 *
 * @param {Object} taskData - Les donn es de la t che  cr eer.
 *
 * @returns {Promise<Object>} La t che cr e e.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const createTask = async (taskData) => {
  const response = await fetch( `${API_URL}/tasks/create_task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re les 20 derni res t ches cr e es par l'utilisateur.
 *
 * @returns {Promise<Object[]>} Les 20 derni res t ches cr e es.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getRecentTasks = async () => {
  const response = await fetch( `${API_URL}/tasks/tasks_twenty`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re toutes les t ches cr e es par l'utilisateur.
 *
 * @returns {Promise<Object[]>} Les t ches cr e es.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getAllTasks = async () => {
  const response = await fetch( `${API_URL}/tasks/tasks`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re une t che sp cifique.
 *
 * @param {string} taskId L'ID de la t che   r cup rer.
 *
 * @returns {Promise<Object>} La t che r cup r e.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getTask = async (id) => {
    try {
        const response = await fetch(`${API_URL}/tasks/task/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la tâche');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur dans getTask:', error);
        throw error;
    }
};

/**
 * Supprime une t che.
 *
 * @param {string} taskId L'ID de la t che   supprimer.
 *
 * @returns {Promise<Object>} La r ponse du serveur apr s suppression.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const deleteTask = async (taskId) => {
  const response = await fetch(  `${API_URL}/tasks/task/${taskId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Met   jour une t che.
 *
 * @param {string} taskId L'ID de la t che   mettre   jour.
 * @param {Object} taskData Les donn es   mettre   jour.
 *
 * @returns {Promise<Object>} La r ponse du serveur apr s mise   jour.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const updateTask = async (taskId, taskData) => {
  const response = await fetch(  `${API_URL}/tasks/task/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Change l' t   complet   d'une t che.
 *
 * @param {string} taskId L'ID de la t che   mettre   jour.
 *
 * @returns {Promise<Object>} La r ponse du serveur apr s mise   jour.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const toggleTaskCompletion = async (taskId) => {
  if (!taskId) {
    throw new Error('Task ID is required');
  }
  const response = await fetch(`${API_URL}/tasks/task/${taskId}/toggle-completion`, {
    method: 'PATCH',
    credentials: 'include'
  });
  return handleResponse(response);
};
/**
 * Active ou d active les notifications pour une t che.
 *
 * @param {string} taskId L'ID de la t che   mettre   jour.
 * @param {Object} subscription L'objet de souscription   envoyer pour activer/d sactiver les notifications.
 *
 * @returns {Promise<Object>} La r ponse du serveur apr s mise   jour.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const toggleTaskNotifications = async (taskId, subscription) => {
  const response = await fetch(  `${API_URL}/tasks/task/${taskId}/toggle-notifications`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription }),
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re toutes les t ches appartenant   une cat gorie.
 *
 * @param {string} category L'ID de la cat gorie   partir de laquelle chercher les t ches.
 *
 * @returns {Promise<Object[]>} La liste des t ches appartenant   cette cat gorie.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */

export const getTasksByCategory = async (categoryId) => {
  try {
    const response = await fetch(`/api/tasks/by-category/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tâches par catégorie');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

/**
 * R cup re toutes les t ches tri es par date d' ch ance.
 *
 * @returns {Promise<Object[]>} La liste des t ches tri es par date d' ch ance.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getTasksSortedByDeadline = async () => {
  const response = await fetch( `${API_URL}/tasks/tasks/sort/deadline`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re toutes les t ches tri es par ordre alphab tique.
 *
 * @returns {Promise<Object[]>} La liste des t ches tri es par ordre alphab tique.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getTasksSortedAlphabetically = async () => {
  const response = await fetch( `${API_URL}/tasks/tasks/sort/alphabetical`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re toutes les t ches en fonction de leur statut.
 *
 * @param {boolean} completed Le statut de la t che.
 *
 * @returns {Promise<Object[]>} La liste des t ches correspondant au statut.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getTasksByStatus = async (completed) => {
  const response = await fetch(  `${API_URL}/tasks/tasks/status/${completed}`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

export const getTasksForList = async (taskListId) => {
  try {
    const response = await fetch(`/api/tasklists/${taskListId}/tasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tâches pour cette liste');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};