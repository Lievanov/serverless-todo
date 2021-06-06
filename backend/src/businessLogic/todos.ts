import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess();

export async function getUserTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getUserTodos(userId)
}

export async function getTodoById(todoId: string, userId: string): Promise<TodoItem> {
    return todoAccess.getTodoById(todoId, userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    const todoId = uuid.v4()
    return await todoAccess.createTodo({
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    })
}

export async function deleteTodo(
    todoId: string
): Promise<string> {
    return await todoAccess.deleteTodo(todoId);
}

export async function updateTodo(
    todoId: string,
    todo: UpdateTodoRequest
): Promise<UpdateTodoRequest> {
    return await todoAccess.updateTodo(todoId, todo)
}

export async function getUploadUrl(todoId: string, userId: string) {
    return todoAccess.getUploadUrl(todoId, userId)
}