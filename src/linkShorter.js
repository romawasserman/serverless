const AWS = require("aws-sdk")
const crypto = require("crypto")
const { addToDb } = require("./database/dbHelpers")
const {setExpirationDate} = require('./helpers/dateHelper')
const { defaultError, customError } = require("./helpers/errors")

const getUser = async (event) => {
  try {
    const { email } = event.requestContext.authorizer.lambda
    const { originalUrl, expiration } = JSON.parse(event.body)
    console.log(event.requestContext);

    const shortId = crypto.randomBytes(3).toString("hex")
    let expirationTime
    if (expiration === "7") {
      expirationTime = setExpirationDate(7)
    } else if (expiration === "3") {
      expirationTime = setExpirationDate(3)
    } else if (expiration === "1") {
      expirationTime = setExpirationDate(1)
    } else if (expiration === "onclick") {
      expirationTime = "onclick"
    } else {
      return customError(400, 'Invalid expiration option ')
    }
    if (!originalUrl) {
      return defaultError
    }

    const itemParams = {
        id: shortId,
        email,
        expirationTime,
        originalUrl,
        clicked: 0,
    }
    await addToDb("ShortLinksTable", itemParams)
    const shortLink = `https://ytmgwl1cx6.execute-api.us-east-1.amazonaws.com/${shortId}`
    if (expirationTime !== "onclick") {
      scheduler = new AWS.Scheduler()
      const scheduleParams = {
        FlexibleTimeWindow: {
          Mode: "OFF",
        },
        Name: shortId,
        ScheduleExpression: `at(${expirationTime})`,
        Target: {
          Arn: `arn:aws:lambda:us-east-1:${process.env.AWS_ID}:function:serverless-dev-eventBridgeCheck`,
          RoleArn: `arn:aws:iam::${process.env.AWS_ID}:role/scheduler-role`,
          Input: JSON.stringify({ shortLink, email, originalUrl, shortId }),
        },
        State: "ENABLED",
      }

      await scheduler.createSchedule(scheduleParams).promise()
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ shortLink: shortLink, dbItem: itemParams }),
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
