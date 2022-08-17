const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { genAccessToken, genRefreshToken } = require("../utils/genToken")
const isAuth = require("../utils/isAuth")
const resolvers = {
  Query: {
    // Middleware test resolver
    async getMe(parent, args, context, info) {
      try {
        // Decode the token to get the user ID
        const isAuthUser = await isAuth(context.req)
        const loggedInUser = await User.findById(isAuthUser.id)

        if (!loggedInUser) {
          throw new Error("No user found")
        }
        return loggedInUser
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    async registerUser(parent, args, { res }, info) {
      // Check if user already exists
      const userExists = await User.findOne({ email: args.email })
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
        const refreshToken = genRefreshToken(createUser.id)

        res.cookie("rfTkn", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })

        return {
          accessToken: genAccessToken(createUser.id),
          success: true,
        }
      }
    },
    async loginUser(parent, args, { res }, info) {
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

      if (isPasswordCorrect) {
        const refreshToken = genRefreshToken(userExists._id)

        res.cookie("rfTkn", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })

        return {
          accessToken: genAccessToken(userExists._id),
          success: true,
        }
      }
    },
  },
}

module.exports = resolvers
