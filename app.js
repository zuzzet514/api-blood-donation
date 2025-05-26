import express from 'express';
import cors from 'cors';
import connectToDB from "./utils/db/dbConnection.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
const PORT = 3000;

const initializeApp = async () => {

    const dbConnection = await connectToDB();

    try {
        app.use(cors());
        app.use(express.json());

        app.use('/api', apiRoutes);

        if (process.env.NODE_ENV !== 'test') {
            const server = app.listen(PORT, () => {
                console.log(`Server listening on port ${PORT}`);
            })

            return { app, server, dbConnection }

        }


    } catch (error) {
        console.error('Initialization error:', error);
    }
}

export default initializeApp;