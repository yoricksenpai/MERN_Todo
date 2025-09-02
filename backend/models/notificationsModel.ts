import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: string;
  message: string;
  type: 'task_reminder' | 'system_message' | 'other';
  isRead: boolean;
  createdAt: Date;
}

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
    enum: ['task_reminder', 'system_message', 'other'] // Vous pouvez ajouter d'autres types selon vos besoins
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