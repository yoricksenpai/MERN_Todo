import { TaskList, ApiResponse } from '../types';
import API_BASE_URL from '../constants/Api';

const API_URL = API_BASE_URL; 


// Fonction utilitaire pour gérer les erreurs
const handleResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

// Fonctions TaskList

export const createTaskList = async (name: string, description?: string): Promise<TaskList> => {
  const response = await fetch(`${API_URL}/tl/tasklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getAllTaskLists = async (): Promise<TaskList[]> => {
  const response = await fetch(`${API_URL}/tl/tasklists`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateTaskList = async (id: string, name: string, description?: string): Promise<TaskList> => {
  const response = await fetch(`${API_URL}/tl/tasklist/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const removeTaskFromList = async (listId: string, taskId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/tasklists/${listId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to remove task from list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error removing task from list:', error);
    throw error;
  }
};

export const deleteTaskList = async (id: string, deleteTasks: boolean = false): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/tl/tasklist/${id}?deleteTasks=${deleteTasks}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

export const shareTaskList = async (listId: string, email: string, permissions: 'read' | 'write'): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/tl/${listId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, permissions }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to share task list');
  }

  return response.json();
};

export const unshareTaskList = async (id: string, userId: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/tl/tasklist/${id}/unshare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getTasksForList = async (listId: string): Promise<any[]> => {
  const response = await fetch(`${API_URL}/tl/tasklist/${listId}/tasks`, {
    method: 'GET',
    credentials: 'include', // Pour inclure les cookies dans la requête
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve tasks for list');
  }
  return response.json();
};
export const updateTaskListPermissions = async (listId: string, userId: string, permissions: 'read' | 'write'): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/tl/tasklist/${listId}/permissions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, permissions }),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Dans api/tasklist.js

export const addTaskToList = async (listId: string, taskId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/tl/tasklist/${listId}/task/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    return response.json();
};
export const deleteTaskFromList = async (listId: string, taskId: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/tl/tasklist/${listId}/task/${taskId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task from list');
  }
  return response.json();
};
