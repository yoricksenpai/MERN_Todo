export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  category: string;
  author: string;
  completed: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  author: string;
}

export interface TaskList {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  sharedWith?: Array<{
    user: string;
    permissions: 'read' | 'write';
  }>;
  tasks: string[];
  type?: 'owned' | 'shared';
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  success?: boolean;
}