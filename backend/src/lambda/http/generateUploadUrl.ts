import 'source-map-support/register'
import * as middy from 'middy'

import { cors } from 'middy/middlewares'
import { getUserId } from '../../utils/authHelper'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUploadUrl } from '../../businessLogic/todos'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    console.log(`Upload image for user: ${userId} for Todo: ${todoId}`)

    const url = await getUploadUrl(todoId, userId)
    return {
        statusCode: 200,
        body: JSON.stringify({
            uploadUrl: url
        })
    }
})

handler.use(
    cors({
      credentials: true
    })
)
