import { User, ApiResponse } from '../types';
import API_BASE_URL from '../constants/Api';

const API_URL = API_BASE_URL; 

const handleResponse = async <T = any>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw data.error || response.statusText;
  }
  return data;
};

export const register = async (username: string, email: string, password: string): Promise<ApiResponse> => {
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

export const login = async (username: string, password: string): Promise<User> => {
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
export const logout = async (): Promise<boolean> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return response.ok;
};

export const getProfile = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    credentials: 'include'
  });
  return handleResponse(response);
};

export const fetchNotifications = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/auth/notifications`, {
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

export const dismissNotification = async (notificationId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/notifications/${notificationId}/read`, {
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
