const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk');

const generateJwtToken = (user) => {
  const token = jwt.sign({ username: user.userEmail }, "secret-key", {
    expiresIn: "1d",
  });
  return token;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { username: user.userEmail },
    "refresh-secret-key",
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  let user;

  try {
    const { userEmail, password } = JSON.parse(event.body);

    const result = await dynamodb
      .get({
        TableName: "UserTable",
        Key: { userEmail: userEmail },
      })
      .promise();

    user = result.Item;

    if (!user || user.password !== password) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user);

    const newUser = {
      userEmail,
      refreshToken,
    };

    const params = {
      TableName: 'UserTableTokens',
      Item: newUser,
      ConditionExpression: 'attribute_not_exists(userEmail)',
    };

    try {
      await dynamodb.put(params).promise();
      console.log('User added to database');
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        const updateParams = {
          TableName: 'UserTableTokens',
          Key: {
            userEmail,
          },
          UpdateExpression: 'SET refreshToken = :refreshToken',
          ExpressionAttributeValues: {
            ':refreshToken': refreshToken,
          },
        };

        await dynamodb.update(updateParams).promise();
        console.log('Refresh token updated');
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ token: jwtToken, refreshToken }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
