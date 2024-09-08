import mongoose from 'mongoose';
import { env, exit } from 'node:process';


/**
 * Connects to MongoDB using the connection string provided in the environment variables.
 *
 * @return {Promise<void>} A Promise that resolves when the connection is established,
 *                         and rejects with an error if it fails.
 */
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    try {
        await mongoose.connect(env.MONGODB_URI, {

        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        exit(1);
    }
};

export default connectDB;