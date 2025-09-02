import { Task, ApiResponse } from '../types';
import { cache } from '../utils/cache';
import API_BASE_URL from '../constants/Api';

const API_URL = API_BASE_URL; 


const handleResponse = async <T = any>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw data.error || response.statusText; // Jetez une erreur si la réponse n'est pas OK
  }
  return data; // Renvoie les données si la réponse est OK
};
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/create_task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
    credentials: 'include'
  });
  const data = await handleResponse<Task>(response);
  // Invalider le cache après création
  cache.delete('all-tasks');
  cache.delete('recent-tasks');
  return data;
};

export const getRecentTasks = async (): Promise<Task[]> => {
  const cacheKey = 'recent-tasks';
  const cached = cache.get<Task[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_URL}/tasks/tasks_twenty`, {
    method: 'GET',
    credentials: 'include'
  });
  const data = await handleResponse<Task[]>(response);
  cache.set(cacheKey, data, 30000); // Cache 30 secondes
  return data;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const cacheKey = 'all-tasks';
  const cached = cache.get<Task[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_URL}/tasks/tasks`, {
    method: 'GET',
    credentials: 'include'
  });
  const data = await handleResponse<Task[]>(response);
  cache.set(cacheKey, data, 60000); // Cache 1 minute
  return data;
};

export const getTask = async (id: string): Promise<Task> => {
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

export const deleteTask = async (taskId: string): Promise<ApiResponse> => {
  const response = await fetch(  `${API_URL}/tasks/task/${taskId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return handleResponse(response);
};

export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await fetch(  `${API_URL}/tasks/task/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
    credentials: 'include'
  });
  return handleResponse(response);
};

export const toggleTaskCompletion = async (taskId: string): Promise<Task> => {
  try {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    const response = await fetch(`${API_URL}/tasks/task/${taskId}/toggle-completion`, {
      method: 'PATCH',
      credentials: 'include'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Erreur dans toggleTaskCompletion:', error);
    throw error; // Assurez-vous de bien jeter l'erreur pour que le try/catch dans le composant puisse la capturer
  }
};


export const toggleTaskNotifications = async (taskId: string, subscription: PushSubscription | any): Promise<Task> => {
  try {
    if (!taskId) throw new Error('Task ID is required');
    if (!subscription || typeof subscription !== 'object') {
      throw new Error('Invalid subscription data');
    }

    // Normaliser la subscription pour s'assurer d'avoir endpoint et keys { p256dh, auth }
    const toBase64Url = (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const subObj: any = typeof (subscription as any).toJSON === 'function' ? (subscription as any).toJSON() : subscription;

    if (!subObj?.endpoint) {
      throw new Error('Invalid subscription object: missing endpoint');
    }

    let keys = subObj.keys as { p256dh: string; auth: string } | undefined;

    // Si les keys ne sont pas présentes dans toJSON, essayer de les extraire depuis getKey
    if (!keys || !keys.p256dh || !keys.auth) {
      try {
        const rawP256dh = (subscription as any).getKey?.('p256dh');
        const rawAuth = (subscription as any).getKey?.('auth');
        if (rawP256dh && rawAuth) {
          keys = { p256dh: toBase64Url(rawP256dh), auth: toBase64Url(rawAuth) };
        }
      } catch (e) {
        // ignore, on validera juste après
      }
    }

    if (!keys || !keys.p256dh || !keys.auth) {
      throw new Error('Invalid subscription object: missing endpoint or keys');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // Timeout de 10 secondes

    const response = await fetch(`${API_URL}/tasks/task/${taskId}/toggle-notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: { endpoint: subObj.endpoint, keys } }),
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeout); // Annuler le timeout si la requête réussit
    return await handleResponse(response);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Requête annulée en raison d\'un timeout.');
    }
    console.error('Erreur dans toggleTaskNotifications:', error);
    throw error;
  }
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

export const getTasksByCategory = async (categoryId: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/by-category/${categoryId}`, {
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * R cup re toutes les t ches tri es par date d' ch ance.
 *
 * @returns {Promise<Object[]>} La liste des t ches tri es par date d' ch ance.
 *
 * @throws {Error} Si la r ponse du serveur n' tait pas OK.
 */
export const getTasksSortedByDeadline = async (): Promise<Task[]> => {
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
export const getTasksSortedAlphabetically = async (): Promise<Task[]> => {
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
export const getTasksByStatus = async (completed: boolean): Promise<Task[]> => {
  const response = await fetch(  `${API_URL}/tasks/tasks/status/${completed}`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

export const getTasksForList = async (taskListId: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/tasklist/${taskListId}/tasks`, {
    credentials: 'include'
  });
  return handleResponse(response);
};
