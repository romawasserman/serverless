const AWS = require('aws-sdk');

module.exports.handler = async (event, context) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const sqs = new AWS.SQS();

  try {
    const scanParams = {
      TableName: 'ShortLinksTable',
    };
    const scanResult = await dynamodb.scan(scanParams).promise();
    const items = scanResult.Items;

    for (const item of items) {
      if (Date.now() / 1000 > item.expirationTime) {
        const deleteParams = {
          TableName: 'ShortLinksTable',
          Key: { id: item.id },
        };

        await sqs
          .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify({
              email: item.email,
              msg: `Your link ${item.id}, that refers to ${item.originalUrl} is deleted`,
              subject: 'Link deactivation',
            }),
          })
          .promise();

        await dynamodb.delete(deleteParams).promise();
      }
    }

    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
