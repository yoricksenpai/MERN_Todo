import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  pushSubscription?: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  deadline: Date;
  category: string;
  author: string;
  completed: boolean;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  author: string;
}

export interface ITaskList extends Document {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  sharedWith: Array<{
    user: string;
    permissions: 'read' | 'write';
  }>;
  tasks: string[];
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}