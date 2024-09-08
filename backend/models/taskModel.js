import mongoose from 'mongoose';

const taskListSchema = new mongoose.Schema({
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

export const TaskList = mongoose.model('TaskList', taskListSchema);



const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    deadline: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref:'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    completed: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema)
export default Task