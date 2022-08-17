const { gql } = require("apollo-server-express")
const typeDefs = gql`
  type Query {
    getUser(id: ID!): [User]
    getMe: User
  }

  type User {
    id: ID!
    name: String
    email: String
  }

  type accessToken {
    token: String!
  }

  type SuccessResponse {
    accessToken: String!
    success: Boolean!
  }
  type Mutation {
    registerUser(
      name: String!
      email: String!
      password: String!
    ): SuccessResponse
  }
  type Mutation {
    loginUser(email: String!, password: String!): SuccessResponse
  }
  type Mutation {
    refreshToken(refreshToken: String!): accessToken
  }
`
module.exports = typeDefs
