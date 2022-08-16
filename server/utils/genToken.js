const jwt = require("jsonwebtoken")

const genAccessToken = userId => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  })
}

const genRefreshToken = userId => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  })
}

module.exports = { genRefreshToken, genAccessToken }
