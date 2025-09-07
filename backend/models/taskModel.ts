import mongoose, { Schema } from 'mongoose';
import { ITask, ITaskList } from '../types/index.js';

const taskListSchema = new Schema<ITaskList>({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        permissions: { type: String, enum: ['read', 'write'], default: 'read' }
    }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, {
    timestamps: true
});

export const TaskList = mongoose.model<ITaskList>('TaskList', taskListSchema);

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String},
    deadline: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref:'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    completed: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: false },
}, {
    timestamps: true
});

const Task = mongoose.model<ITask>('Task', taskSchema)
export default Task