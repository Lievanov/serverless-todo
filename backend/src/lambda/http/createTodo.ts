import 'source-map-support/register'

import * as middy from 'middy'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../../utils/authHelper'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todos'

const logger = createLogger('todos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    logger.info(`Get Todos for user ID: ${userId}`)

    const createdTodo = await createTodo(newTodo, userId)
    return {
        statusCode: 201,
        body: JSON.stringify({
            item: createdTodo
        })
    }
})

handler.use(
    cors({
      credentials: true
    })
  )
  
