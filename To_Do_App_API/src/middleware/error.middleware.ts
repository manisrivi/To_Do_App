import { Request, Response, NextFunction } from 'express';

// 404 Route Not Found Middleware
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
};

// Global Error Handler Middleware
export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error('Server Error:', err);

    // Mongoose Invalid ObjectId Cast Error
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ID format: ${err.value}`
        });
    }

    // Mongoose Validation Error (e.g. required field missing)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e: any) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }

    // Default Internal Server Error
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
