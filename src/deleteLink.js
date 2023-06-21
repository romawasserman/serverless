const AWS = require('aws-sdk');


module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { email } = event.requestContext.authorizer.lambda
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: "ShortLinksTable",
      Key: { id },
    };
    const result = await dynamodb.get(params).promise();
    const { Item } = result;

    if (Item && (Item.email == email)) {
      await dynamodb.delete(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Item with id ${id} deleted` }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'provided Id not found' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
