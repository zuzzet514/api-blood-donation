import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectToDB } from "./utils/db/dbConnection.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
const PORT = 3000;

const initializeApp = async () => {
  try {
    await connectToDB();

    app.use(cors());
    app.use(express.json());
    app.use('/api', apiRoutes);

    const server = app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Server listening on port ${PORT}`);
      }
    });

    return { app, server };
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
};

export default initializeApp;
