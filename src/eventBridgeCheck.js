const { deleteFromDb } = require("./database/dbHelpers")
const { defaultError } = require("./helpers/errors")
const { sendSQSMessage } = require("./helpers/sqsHelper")
const sendMessage = async (event) => {
  const { shortLink, shortId } = event

  try {
    await sendSQSMessage(process.env.QUEUE_URL, shortLink, event)
    await deleteFromDb("ShortLinksTable", { id: shortId })

    return {
      statusCode: 200,
    }
  } catch (error) {
    console.error(error)
    return defaultError()
  }
}

module.exports = {
  handler: sendMessage,
}
