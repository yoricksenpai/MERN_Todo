import mongoose from 'mongoose';
import { env, exit } from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);
    try {
        const mongoUri = env.MONGO_URI || 'mongodb://localhost:27017/todo';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        exit(1);
    }
};

export default connectDB;