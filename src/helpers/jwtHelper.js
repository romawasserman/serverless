const jwt = require("jsonwebtoken")

const generateJwtToken = (user) => {
  const token = jwt.sign({ username: user.userEmail }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  })
  return token
}

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { username: user.userEmail },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  )
  return refreshToken
}

const decodeAccessToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY)
}

const decodeRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_SECRET_KEY)
}

module.exports = {
  generateJwtToken,
  generateRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
}
