const { updateIteminDb, getFromDb } = require("./database/dbHelpers.js")
const { decodeRefreshToken, generateJwtToken, generateRefreshToken } = require("./helpers/jwtHelper.js")
const { customResponse } = require("./helpers/response.js")
const { customError } = require("./helpers/errors.js")

const refreshTokens = async (event) => {
  let user
  try {
    const { refreshToken } = JSON.parse(event.body)
    const decoded = decodeRefreshToken(refreshToken)
    const result = await getFromDb("UserTableTokens", {
      userEmail: decoded.username,
    })
    user = result.Item

    if (user.refreshToken !== refreshToken) {
      return customError(500, "invalid refresh token")
    }
    const newRefreshToken = generateRefreshToken(user)
    const newAccessToken = generateJwtToken(user)

    await updateIteminDb(
      "UserTableTokens",
      { userEmail: decoded.username },
      "SET refreshToken = :refreshToken",
      {
        ":refreshToken": newRefreshToken,
      }
    )
    console.log("Refresh token updated")
    return customResponse(200, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.log(error)
    return customError(500,{ error: "An error occurred during token refresh" } )
  }
}
module.exports = {
  handler: refreshTokens,
}
