const AWS = require('aws-sdk');


module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { email } = event.requestContext.authorizer.lambda
  try {
    const params = {
      TableName: "ShortLinksTable",
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": email
      }
    };
    const result = await dynamodb.scan(params).promise();
    const { Items } = result;

    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
