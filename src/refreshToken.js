const jwt = require("jsonwebtoken")
const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient()
  let user
  try {
    const { refreshToken } = JSON.parse(event.body)
    const decoded = jwt.verify(refreshToken, "refresh-secret-key")
    const result = await dynamodb
      .get({
        TableName: "UserTableTokens",
        Key: { userEmail: decoded.username },
      })
      .promise()
    user = result.Item

    if (user.refreshToken !== refreshToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "invalid refresh token" }),
      }
    }
    const newRefreshToken = jwt.sign(
      { username: decoded.username },
      "refresh-secret-key",
      {
        expiresIn: "7d",
      }
    )
    const newAccessToken = jwt.sign(
      { username: decoded.username },
      "secret-key",
      {
        expiresIn: "1m",
      }
    )

    const updateParams = {
      TableName: "UserTableTokens",
      Key: {
        userEmail: decoded.username,
      },
      UpdateExpression: "SET refreshToken = :refreshToken",
      ExpressionAttributeValues: {
        ":refreshToken": newRefreshToken,
      },
    }

    await dynamodb.update(updateParams).promise()
    console.log("Refresh token updated")
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred during token refresh" }),
    }
  }
}

