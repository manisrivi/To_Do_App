import Todo, { ITodo } from '../models/ToDo';

export class TodoService {
    // 1. Create a new todo
    async createTodo(title: string): Promise<ITodo> {
        const todo = new Todo({
            title: title.trim(),
            completed: false
        });
        return await todo.save();
    }

    // 2. Fetch all todos (newest first)
    async getAllTodos(): Promise<ITodo[]> {
        return await Todo.find().sort({ createdAt: -1 });
    }

    // 3. Fetch a single todo by ID
    async getTodoById(id: string): Promise<ITodo | null> {
        return await Todo.findById(id);
    }

    // 4. Update todo title and/or completed status
    async updateTodo(
        id: string,
        updates: { title?: string; completed?: boolean }
    ): Promise<ITodo | null> {
        return await Todo.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );
    }

    // 5. Toggle todo completed status (false -> true, true -> false)
    async toggleTodoStatus(id: string): Promise<ITodo | null> {
        const todo = await Todo.findById(id);
        if (!todo) return null;

        todo.completed = !todo.completed;
        return await todo.save();
    }

    // 6. Delete a todo by ID
    async deleteTodo(id: string): Promise<ITodo | null> {
        return await Todo.findByIdAndDelete(id);
    }
}

export const todoService = new TodoService();
