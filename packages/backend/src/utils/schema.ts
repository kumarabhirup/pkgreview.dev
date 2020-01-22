const typeDefs = `
  # Returned data after newMail received
  type NewMailResponse {
    email: String!
    channelHash: String!
  }

  # Mutations
  type Mutation {
    exampleMutation: String
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
