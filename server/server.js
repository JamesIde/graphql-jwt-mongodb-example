require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const colors = require("colors")
const resolvers = require("./resolvers/resolvers")
const schema = require("./schema/schema")
const connectDb = require("./config/connectDB")
const isAuth = require("./utils/isAuth")
connectDb()

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    return await isAuth(req)
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}graphql`.cyan.underline)
})
