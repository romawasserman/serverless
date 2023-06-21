const AWS = require("aws-sdk")

module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient()
  try {
    const { id } = event.pathParameters

    const params = {
      TableName: "ShortLinksTable",
      Key: { id },
    }
    const result = await dynamodb.get(params).promise()
    const { Item } = result

    if (
      Item &&
      (Item.expirationTime === "onclick" ||
        Item.expirationTime > Math.floor(Date.now() / 1000))
    ) {
      if (Item.expirationTime === "onclick") {
        await dynamodb.delete(params).promise()
        const sqs = new AWS.SQS()
        await sqs
          .sendMessage({
            QueueUrl: process.env.QUEUE_URL,

            MessageBody: JSON.stringify({
              email: Item.email,
              msg: `Your link ${id}, that refers to ${Item.originalUrl} is deleted`,
              subject: `Link deactivation`
            }),
          })
          .promise()
          return {
            statusCode: 302,
            headers: {
              Location: Item.originalUrl,
            },
          }
      } else {
        const updateParams = {
          TableName: "ShortLinksTable",
          Key: { id },
          UpdateExpression: "SET #clicked = #clicked + :increment",
          ExpressionAttributeNames: {
            "#clicked": "clicked",
          },
          ExpressionAttributeValues: {
            ":increment": 1,
          },
        }
        await dynamodb.update(updateParams).promise()
      }
      return {
        statusCode: 302,
        headers: {
          Location: Item.originalUrl,
        },
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Short link not found or expired" }),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    }
  }
}
