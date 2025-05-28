import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ENV = process.env.NODE_ENV || 'development';
const dbUri = ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI;

export const connectToDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log(`Connected to MongoDB ${ENV}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log(`Disconnected from MongoDB ${ENV}`);
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};
