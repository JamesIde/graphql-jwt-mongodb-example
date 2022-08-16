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

  type SuccessLoginResponse {
    name: String!
    email: String!
    message: String!
    accessToken: String!
    refreshToken: String
  }
  type Mutation {
    registerUser(
      name: String!
      email: String!
      password: String!
    ): SuccessLoginResponse
  }
  type Mutation {
    loginUser(email: String!, password: String!): SuccessLoginResponse
  }
  type Mutation {
    refreshToken(refreshToken: String!): accessToken
  }
`
module.exports = typeDefs
