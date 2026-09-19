import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

const app = express();

// 1. Configure CORS for React frontend (http://localhost:5173)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: [clientUrl, 'http://localhost:5173'],
    credentials: true
}));

// 2. Parse incoming JSON payloads
app.use(express.json());

// 3. Health check root endpoint
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'To_Do_API is Running Successfully'
    });
});

// 4. Mount Todo API routes
app.use('/api/todos', todoRoutes);

// 5. Fallback 404 handler for unknown routes
app.use(notFoundHandler);

// 6. Centralized error handling middleware
app.use(errorHandler);

export default app;
