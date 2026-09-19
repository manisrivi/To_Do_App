import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { todoService } from '../services/todo.service';

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id: unknown): id is string => {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
};

// 1. POST /api/todos - Create new todo
export const createTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title } = req.body;

        // Validation: title must exist and not be empty whitespace
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title is required and cannot be empty'
            });
        }

        const newTodo = await todoService.createTodo(title);

        return res.status(201).json({
            success: true,
            data: newTodo
        });
    } catch (error) {
        next(error);
    }
};

// 2. GET /api/todos - Get all todos
export const getAllTodos = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const todos = await todoService.getAllTodos();
        return res.status(200).json({
            success: true,
            data: todos
        });
    } catch (error) {
        next(error);
    }
};

// 3. GET /api/todos/:id - Get todo by ID
export const getTodoById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Todo ID format'
            });
        }

        const todo = await todoService.getTodoById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        next(error);
    }
};

// 4. PUT /api/todos/:id - Update todo title and completed
export const updateTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Todo ID format'
            });
        }

        // Validate title if supplied
        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be empty'
                });
            }
        }

        // Validate completed if supplied
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Completed must be a boolean (true or false)'
            });
        }

        const updates: { title?: string; completed?: boolean } = {};
        if (title !== undefined) updates.title = title.trim();
        if (completed !== undefined) updates.completed = completed;

        const updatedTodo = await todoService.updateTodo(id, updates);

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedTodo
        });
    } catch (error) {
        next(error);
    }
};

// 5. PATCH /api/todos/:id/toggle - Toggle completed status
export const toggleTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Todo ID format'
            });
        }

        const toggledTodo = await todoService.toggleTodoStatus(id);

        if (!toggledTodo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: toggledTodo
        });
    } catch (error) {
        next(error);
    }
};

// 6. DELETE /api/todos/:id - Delete todo
export const deleteTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Todo ID format'
            });
        }

        const deletedTodo = await todoService.deleteTodo(id);

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
            data: deletedTodo
        });
    } catch (error) {
        next(error);
    }
};

