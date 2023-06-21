const AWS = require('aws-sdk');

const addUser = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { userEmail, password } = JSON.parse(event.body);

  const newUser = {
    userEmail,
    password,
  };

  try {
    await dynamodb.put({
      TableName: 'UserTable',
      Item: newUser,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add user' }),
    };
  }
};

module.exports = {
  handler: addUser,
};
