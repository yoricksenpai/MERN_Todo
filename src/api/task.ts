import { Types } from 'mongoose';

// Type Definitions
interface User {
  _id: Types.ObjectId;
  username?: string;
}

interface Category {
  _id: Types.ObjectId;
  name: string;
}

interface Task {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  deadline?: Date;
  category?: Types.ObjectId | Category;
  author?: Types.ObjectId | User;
  completed: boolean;
  notificationsEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskList {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  owner: Types.ObjectId | User;
  tasks: Types.ObjectId[] | Task[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Configuration
const isProd = import.meta.env.PROD;
const API_URL = '/api';

/**
 * Handles JSON responses from the server
 */
const handleResponse = async (response: Response): Promise<any> => {
  const data = await response.json();
  if (!response.ok) {
    throw data.error || response.statusText;
  }
  return data;
};

/**
 * Creates a new task
 */
export const createTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/create_task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves the 20 most recent tasks
 */
export const getRecentTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/tasks_twenty`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves all tasks
 */
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/tasks`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves a specific task by ID
 */
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

/**
 * Deletes a task
 */
export const deleteTask = async (taskId: string): Promise<any> => {
  const response = await fetch(`${API_URL}/tasks/task/${taskId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Updates a task
 */
export const updateTask = async (taskId: string, taskData: Partial<Omit<Task, '_id'>>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/task/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Toggles task completion status
 */
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
    throw error;
  }
};

/**
 * Toggles task notifications
 */
export const toggleTaskNotifications = async (taskId: string, subscription: any): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/tasks/task/${taskId}/toggle-notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription }),
      credentials: 'include'
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Erreur dans toggleTaskNotifications:', error);
    throw error;
  }
};

/**
 * Retrieves tasks by category
 */
export const getTasksByCategory = async (categoryId: string): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks/by-category/${categoryId}`, {
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
 * Retrieves tasks sorted by deadline
 */
export const getTasksSortedByDeadline = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/tasks/sort/deadline`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves tasks sorted alphabetically
 */
export const getTasksSortedAlphabetically = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/tasks/sort/alphabetical`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves tasks by completion status
 */
export const getTasksByStatus = async (completed: boolean): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/tasks/status/${completed}`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves tasks for a specific task list
 */
export const getTasksForList = async (taskListId: string): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasklists/${taskListId}/tasks`, {
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