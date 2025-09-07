import mongoose, { Schema } from "mongoose";
import { INotification } from '../types/index.js';

const notificationSchema = new Schema<INotification>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['task_reminder', 'system_message', 'other']
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;