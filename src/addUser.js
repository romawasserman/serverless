const bcrypt = require("bcryptjs")

const { customResponse } = require("./helpers/response.js")
const { customError } = require("./helpers/errors.js")
const { addToDb } = require("./database/dbHelpers.js")

const addUser = async (event) => {
  const { userEmail, password } = JSON.parse(event.body)
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    userEmail,
    password: hashedPassword,
  }

  try {
    await addToDb("UserTable", newUser) // process.env.USER_TABLE ?
    return customResponse(200, { userEmail, password })
  } catch (error) {
    console.log(error)
    return customError(500, "cannot create user")
  }
}

module.exports = {
  handler: addUser,
}
