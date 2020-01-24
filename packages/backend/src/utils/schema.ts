const typeDefs = `
  # Database Fields
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
    package: String! # Package! Populate Later
    createdAt: String!
    updatedAt: String!
  }

  type Flag {
    _id: String!
    by: User!
    review: Review!
    createdAt: String!
    updatedAt: String!
  }

  # Non-Database fields
  type Package {
    name: String!
    type: String!
    version: String!
    maintainers: [Maintainer]
    githubRepoUrl: String
    description: String
    reviews: [Review]
    rating: Float
    isUserMaintainer: Boolean
  }

  type Rating {
    score: Int!
    total: Int!
  }

  input RatingInput {
    score: Int!
    total: Int!
  }

  type Maintainer {
    name: String!
    email: String!
  }

  # Mutations
  type Mutation {
    exampleMutation: String
    loginMutation(codeForToken: String!): User
    writeReview(review: String!, rating: RatingInput!, packageName: String!, currentUserToken: String!): Review
    flagReview(reviewId: String!, currentUserToken: String!): Flag!
  }

  # Queries
  type Query {
    exampleQuery: String
    getCurrentUser(token: String): User
    getPackageAndReviews(slug: String!, type: String!, currentUserToken: String): Package
  }
`

export default typeDefs
