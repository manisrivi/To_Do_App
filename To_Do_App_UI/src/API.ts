const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const createToDo = async (name: string) => {
    const response = await fetch(`${BASE_URL}/api/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: name,
        }),
    });
    const data = await response.json();
    return data;
}

export const deleteToDo = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/todos/` + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await response.json();
    return data;
}

export const updateToDo = async (id: number) => {
    const response = await fetch(`${BASE_URL}/api/todos`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
        }),
    });
    const data = await response.json();
    return data;
}

export const readToDo = async () => {
    const response = await fetch(`${BASE_URL}/api/todos`);
    const data = await response.json();
    return data?.data;
}
