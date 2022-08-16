const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { genAccessToken, genRefreshToken } = require("../utils/genToken")
const resolvers = {
  Query: {
    // Middleware test resolver
    async getMe(parent, args, { id }, info) {
      const user = await User.findById(id)
      if (!user) {
        throw new Error("No user found")
      }
      return user
    },
  },
  Mutation: {
    async registerUser(parent, { email }, context, info) {
      // Check if user already exists
      const userExists = await User.findOne({ email: email })
      if (userExists) {
        throw new Error("User already exists")
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(args.password, 12)

      // Create the user
      const createUser = await User.create({
        name: args.name,
        email: args.email,
        password: hashedPassword,
      })

      // Return the user on success
      if (createUser) {
        return {
          message: "User created successfully",
          name: createUser.name,
          email: createUser.email,
          accessToken: genAccessToken(createUser.id),
          refreshToken: genRefreshToken(createUser.id),
        }
      }
    },
    async loginUser(parent, args, context, info) {
      // Check user
      const userExists = await User.findOne({ email: args.email })

      if (!userExists) {
        throw new Error("User does not exist")
      }

      // Check password
      const isPasswordCorrect = await bcrypt.compare(
        args.password,
        userExists.password
      )

      if (!isPasswordCorrect) {
        throw new Error("Password is incorrect")
      }

      return {
        message: "User logged in successfully",
        name: userExists.name,
        email: userExists.email,
        accessToken: genAccessToken(userExists.id),
        refreshToken: genRefreshToken(userExists.id),
      }
    },

    async refreshToken(parent, { refreshToken }, context, info) {
      const token = refreshToken
      // Check token in header
      if (!token) {
        return ""
      }
      // Verify token
      let payload = null
      try {
        payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
      } catch (error) {
        return ""
      }
      // Check if user matches payload userId
      const user = await User.findOne({ _id: payload.userId })
      if (user._id.toString() !== payload.userId) {
        return ""
      }

      // Token is valid, generate new access token
      return {
        token: genAccessToken(user._id),
      }
    },
  },
}

module.exports = resolvers
