import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoAccess {
    constructor (
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly userIdIndex = process.env.USER_ID_INDEX,
        private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION),

        private readonly s3 = new AWS.S3({
            signatureVersion: 'v4'
        })
        ){
    }

    async getUserTodos(userId: string): Promise<TodoItem[]> {
        const items = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        
        return items.Items as TodoItem[]
    }

    async getTodoById(todoId: string): Promise<TodoItem> {
        const items = await this.docClient.get({
            TableName: this.todosTable,
            Key: { todoId }   
        }).promise()

        return items.Item as TodoItem
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        console.log('Creating a todo with id: ', todo.todoId)
        
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async deleteTodo(todoId: string): Promise<string> {
        console.log('Deleting a todo with id: ', todoId)
        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                "todoId": todoId
            }
        })
        return todoId
    }

    async updateTodo(todoId: string,todo: UpdateTodoRequest): Promise<UpdateTodoRequest> {
        console.log('Updating a todo with id: ', todoId)

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId
            },
            UpdateExpression: 'set todo.name = :n, todo.dueDate = :d, todo.done = :f',
            ExpressionAttributeValues: {
                ":n": todo.name,
                ":d": todo.dueDate,
                ":f": todo.done,
            }
        })
        return todo;
    }

    async getUploadUrl(todoId: string, userId: string) {
        console.log(`Generating URL with todoId: ${todoId} and ${userId} `)
        const generatedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })
        console.log("your new URL: ", generatedUrl)
        await this.docClient.update({
            TableName: this.todosTable,
            Key: { todoId },
            UpdateExpression: "set attachmentUrl=:URL",
            ExpressionAttributeValues: {
              ":URL": generatedUrl.split("?")[0]
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise();

        return generatedUrl
    }
}