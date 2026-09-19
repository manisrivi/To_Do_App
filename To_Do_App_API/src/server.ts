import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

const port = process.env.PORT || 5001;

const startServer = async () => {
    // 1. Connect to MongoDB first
    await connectDB();

    // 2. Start HTTP server only after DB connection is successful
    app.listen(port, () => {
        console.log(`Server is Running on Port : ${port}`);
    });
};

startServer();