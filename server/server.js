//Import dotenv
require("dotenv").config()
const { ApolloServer, gql } = require("apollo-server-express")
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core")
const express = require("express")
const http = require("http")
const colors = require("colors")
const typeDefs = require("./schema/schema")
const resolvers = require("./resolvers/resolvers")

const connectDb = require("./config/connectDb")

async function startApolloServer(typeDefs, resolvers) {
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  })

  await server.start()
  await connectDb()
  server.applyMiddleware({ app })
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(
    `🚀 Server ready at http://localhost:4000${server.graphqlPath}`.cyan
      .underline
  )
}

startApolloServer(typeDefs, resolvers)
