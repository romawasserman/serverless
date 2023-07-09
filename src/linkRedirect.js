const {
  getFromDb,
  updateClicks,
  deleteFromDb,
} = require("./database/dbHelpers")
const { customError } = require("./helpers/errors")
const { sendSQSMessage } = require("./helpers/sqsHelper")

const linkRedirect = async (event) => {
  try {
    const { id } = event.pathParameters

    const result = await getFromDb("ShortLinksTable", { id: id })
    const { Item } = result

    if (Item && Item.expirationTime === "onclick") {
      await deleteFromDb("ShortLinksTable", { id: id })
      await sendSQSMessage(process.env.QUEUE_URL, id, Item)

      return {
        statusCode: 302,
        headers: {
          Location: Item.originalUrl,
        },
      }
    } else {
      await updateClicks(
        "ShortLinksTable",
        { id: id },
        "SET #clicked = #clicked + :increment",
        {
          ":increment": 1,
        }
      )

      return {
        statusCode: 302,
        headers: {
          Location: Item.originalUrl,
        },
      }
    }
  } catch (error) {
    console.error(error)
    return customError(500, "Internal Server Error")
  }
}
module.exports = {
  handler: linkRedirect,
}
