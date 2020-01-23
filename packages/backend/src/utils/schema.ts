const typeDefs = `
  # Returned data after newMail received
  type NewMailResponse {
    email: String!
    channelHash: String!
  }

  type User {
    _id: Int!
    name: String!
    email: String!
    githubUsername: String!
    reviews: [Review]
  }

  type Review {
    _id: Int!
    author: User!
    rating: Rating!
    review: String!
    package: String!
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
  }

  # Subscriptions
  type Subscription {
    newMail(channelHash: String!): NewMailResponse!
  }
`

export default typeDefs
