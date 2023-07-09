const { getFromDb, deleteFromDb } = require("./database/dbHelpers")
const { customError, defaultError } = require("./helpers/errors")
const { customResponse } = require("./helpers/response")

const deleteLink  = async (event) => {
  const { email } = event.requestContext.authorizer.lambda
  try {
    const { id } = event.pathParameters
    const key = { id : id }
    const result = await getFromDb("ShortLinksTable", key)
    const { Item } = result

    if (Item && Item.email == email) {
      await deleteFromDb("ShortLinksTable", key)
      return customResponse(200, { message: `Item with id ${id} deleted` })
    }

    return customError(404, { message: "provided Id not found" })
  } catch (error) {
    console.error(error)
    return defaultError()
  }
}

module.exports = {
  handler: deleteLink,
}
