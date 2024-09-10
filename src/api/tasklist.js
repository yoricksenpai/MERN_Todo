// taskListService.js
const isProd = import.meta.env.PROD // Vite fournit PROD, qui est true en production
const API_URL = isProd 
  ? 'https://mern-todo-backend-nine-sigma.vercel.app/' 
  : '/api'

// Fonction utilitaire pour gérer les erreurs
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

// Fonctions TaskList

export const createTaskList = async (name, description) => {
  const response = await fetch(` ${API_URL}/tl/tasklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return handleResponse(response);
};

export const getAllTaskLists = async () => {
  const response = await fetch(` ${API_URL}/tl/tasklists`);
  return handleResponse(response);
};

export const updateTaskList = async (id, name, description) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return handleResponse(response);
};

export const removeTaskFromList = async (listId, taskId) => {
  try {
    const response = await fetch(`${API_URL}/tasklists/${listId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const deleteTaskList = async (id) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const shareTaskList = async (listId, email, permissions) => {
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

export const unshareTaskList = async (id, userId) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${id}/unshare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return handleResponse(response);
};

export const getTasksForList = async (listId) => {
  const response = await fetch(`${API_URL}/tl/tasklist/${listId}/tasks`, {
    method: 'GET',
    credentials: 'include', // Pour inclure les cookies dans la requête
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve tasks for list');
  }
  return response.json();
};
export const updateTaskListPermissions = async (listId, userId, permissions) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${listId}/permissions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, permissions }),
  });
  return handleResponse(response);
};

// Dans api/tasklist.js

export const addTaskToList = async (listId, taskId) => {
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
export const deleteTaskFromList = async (listId, taskId) => {
  const response = await fetch(`${API_URL}/tl/tasklist/${listId}/task/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task from list');
  }
  return response.json();
};
