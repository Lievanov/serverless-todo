import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    console.log(`Removing todoId: ${todoId}`)
    if (!todoId) {
      logger.error('Todo id required')
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'invalid parameters'
        })
      }
    }
    await deleteTodo(todoId)
    return {
        statusCode: 200,
        body: JSON.stringify({
          item: true
        })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
