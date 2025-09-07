import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
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
  _id: Types.ObjectId;
  title: string;
  description?: string;
  deadline: Date;
  category: Types.ObjectId;
  author: Types.ObjectId;
  completed: boolean;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  author: Types.ObjectId;
}

export interface ITaskList extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  owner: Types.ObjectId;
  sharedWith: Array<{
    user: Types.ObjectId;
    permissions: 'read' | 'write';
  }>;
  tasks: Types.ObjectId[];
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  type: 'task_reminder' | 'system_message' | 'other';
  isRead: boolean;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}