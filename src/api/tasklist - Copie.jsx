// taskListService.js

const API_URL = '/api'; // Utilise le proxy de Vite

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

export const deleteTaskList = async (id) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const shareTaskList = async (id, userId, permissions) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${id}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, permissions }),
  });
  return handleResponse(response);
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
  const response = await fetch(` ${API_URL}/tl/tasklist/${listId}/tasks`);
  return handleResponse(response);
};

export const updateTaskListPermissions = async (listId, userId, permissions) => {
  const response = await fetch(` ${API_URL}/tl/tasklist/${listId}/permissions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, permissions }),
  });
  return handleResponse(response);
};