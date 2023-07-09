const { scanItemsDb } = require("./database/dbHelpers")
const { defaultError } = require("./helpers/errors")
const { customResponse } = require("./helpers/response")

const getAllLinks = async (event) => {
  const { email } = event.requestContext.authorizer.lambda
  try {
    const result = await scanItemsDb(
      "ShortLinksTable",
      "#email = :email",
      {
        "#email": "email",
      },
      {
        ":email": email,
      }
    )
    const { Items } = result

    return customResponse(200, Items)
  } catch (error) {
    console.error(error)
    return defaultError()
  }
}
module.exports = {
  handler: getAllLinks,
}
