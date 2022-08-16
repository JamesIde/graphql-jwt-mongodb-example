const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const isAuth = async req => {

  const token = req.headers.authorization || ""
  // We need to check if there is a token
  if (!token) return

  // Decode the token to get the user ID
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  //   console.log(decoded)
  if (!decoded) {
    throw new Error("Invalid token")
  }

  // Find the user and return it
  const user = await User.findById(decoded.userId)

  if (!user) {
    throw new Error("No user found - try registering.")
  }

  // Format the user object to return
  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  }

  return formattedUser
}

module.exports = isAuth
