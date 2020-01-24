const typeDefs = `
  # Returned data after newMail received
  type NewMailResponse {
    email: String!
    channelHash: String!
  }

  type User {
    _id: String!
    name: String!
    email: String!
    githubUsername: String!
    githubId: Int!
    token: String!
    reviews: [Review]
    createdAt: String!
    updatedAt: String!
  }

  type Review {
    _id: String!
    author: User!
    rating: Rating!
    review: String!
    package: String!
    createdAt: String!
    updatedAt: String!
  }

  type Rating {
    score: Int!
    total: Int!
  }

  # Mutations
  type Mutation {
    exampleMutation: String
    loginMutation(codeForToken: String!): User
  }

  # Queries
  type Query {
    exampleQuery: String
    getCurrentUser(token: String): User
  }
`

export default typeDefs
