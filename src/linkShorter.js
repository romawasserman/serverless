const AWS = require("aws-sdk")
const crypto = require("crypto")

const getUser = async (event) => {
  try {
    const { email } = event.requestContext.authorizer.lambda
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const { originalUrl, expiration } = JSON.parse(event.body)

    const shortId = crypto.randomBytes(3).toString("hex")
    let expirationTime
    if (expiration === "7") {
      expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    } else if (expiration === "3") {
      expirationTime = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60
    } else if (expiration === "1") {
      expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60
    }else if (expiration === "onclick") {
      expirationTime = "onclick"
    } else {
      throw new Error("Invalid expiration option")
    }
    if (!originalUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "There is no link bro" }),
      }
    }

    const params = {
      TableName: "ShortLinksTable",
      Item: {
        id: shortId,
        email,
        expirationTime,
        originalUrl,
        clicked: 0,
      },
    }
    await dynamodb.put(params).promise()
    const shortLink = `https://duoosrfwzl.execute-api.us-east-1.amazonaws.com/${shortId}`

    return {
      statusCode: 200,
      body: JSON.stringify({ shortLink: shortLink, dbItem: params.Item }),
    }
  } catch (error) {
    console.log(error)
  }
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "Something went wrong" }),
  }
}

module.exports = {
  handler: getUser,
}
