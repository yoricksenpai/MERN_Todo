
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
 * Registers a new user.
 *
 * @param {string} email The email address of the user
 * @param {string} password The password of the user
 * @param {string} username The username of the user
 * @returns {Promise<{token: string, user: {id: string, username: string, email: string, role: string}}>}
 *  A promise that resolves with an object containing the JWT token and the newly created user
 */
export const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
};
export const logout = async () => {
  localStorage.removeItem('token');
  // Add any other logout logic here (e.g., calling a logout endpoint)
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

export const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/auth/notifications', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const dismissNotification = async (notificationId) => {
  try {
    const response = await fetch(`/api/auth/notifications/${notificationId}/read`, {
      method: 'POST',
      credentials: 'include', // Pour inclure les cookies dans la requête
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to dismiss notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error dismissing notification:', error);
    throw error;
  }
};