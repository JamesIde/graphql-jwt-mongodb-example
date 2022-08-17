//Import dotenv
require("dotenv").config()
const { ApolloServer } = require("apollo-server-express")
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core")
const express = require("express")
const http = require("http")
const colors = require("colors")
const User = require("./models/userModel")
const jwt = require("jsonwebtoken")
const typeDefs = require("./schema/schema")
const resolvers = require("./resolvers/resolvers")
const { genAccessToken } = require("./utils/genToken")
const connectDb = require("./config/connectDb")

async function startApolloServer(typeDefs, resolvers) {
  const app = express()
  app.get("/", (req, res) => res.send("Hello"))

  // Refresh token from cookie
  app.post("/refresh_token", async (req, res) => {
    const token = req.headers.cookie
    if (!token) {
      return res.send({ ok: false, accessToken: "" })
    }
    // Split it like a auth bearer token
    const refreshToken = token.split(";")[0].split("=")[1]
    let payload
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
      return res.send({ ok: false, accessToken: "" })
    }
    /// Token is valid
    const user = await User.findOne({ id: payload.userId })
    if (user._id.toString() !== payload.userId) {
      console.log("here3")
      return res.send({ ok: false, accessToken: "" })
    }

    // Token is valid, generate new access token
    res.send({ ok: true, accessToken: genAccessToken(user._id) })
  })

  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  })

  await server.start()
  await connectDb()

  const cors = {
    credentials: true,
    origin: "https://studio.apollographql.com",
  }

  server.applyMiddleware({ app, cors })
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(
    `🚀 Server ready at http://localhost:4000${server.graphqlPath}`.cyan
      .underline
  )
}

startApolloServer(typeDefs, resolvers)
