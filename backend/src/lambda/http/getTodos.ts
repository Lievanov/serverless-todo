import 'source-map-support/register'
import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../../utils/authHelper'
import { getUserTodos } from '../../businessLogic/todos'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  logger.info(`Get Todos for user ID: ${userId}`)

  const todos = await getUserTodos(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
