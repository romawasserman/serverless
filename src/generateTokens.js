const {
  getFromDb,
  putItemtoDb,
  updateIteminDb,
} = require("./database/dbHelpers.js")
const { customResponse } = require("./helpers/response.js")
const { defaultError, customError } = require("./helpers/errors.js")
const {
  generateJwtToken,
  generateRefreshToken,
} = require("./helpers/jwtHelper.js")
const bcrypt = require('bcryptjs')

const generateTokens = async (event) => {
  let user;
  try {
    const { userEmail, password } = JSON.parse(event.body)
    const key = {'userEmail' : userEmail}

    const result = await getFromDb("UserTable", key)
    user = result.Item;

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!user || !passwordMatch) {
      return customError(500, "Invalid password or username")
    }

    const jwtToken = generateJwtToken(user)
    const refreshToken = generateRefreshToken(user)

    const newUser = {
      userEmail,
      refreshToken,
    }

    try {
      console.log(11);
      await putItemtoDb(
        "UserTableTokens",
        newUser,
        "attribute_not_exists(userEmail)"
      )

      console.log("User added to database")
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {  
        console.log(22); // Is it ok? 
        await updateIteminDb(
          "UserTableTokens",
          key,
          "SET refreshToken = :refreshToken",
          { ":refreshToken": refreshToken }
        )
        console.log("Refresh token updated")
      } else {
        console.log(error);
        throw error
      }
    }

    return customResponse(200, { token: jwtToken, refreshToken })
  } catch (error) {
    console.error("Error:", error)
    return defaultError()
  }
}


module.exports = {
  handler: generateTokens,
}


