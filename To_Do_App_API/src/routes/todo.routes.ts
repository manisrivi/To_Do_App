import { Router } from 'express';
import {
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    toggleTodo,
    deleteTodo
} from '../controllers/todo.controller';

const router = Router();

// Routes mapping for /api/todos
router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

export default router;
