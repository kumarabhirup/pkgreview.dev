// Mutations
import exampleMutation from './mutations/exampleMutation'
import loginMutation from './mutations/loginMutation'
import writeReviewMutation from './mutations/writeReviewMutation'

// Queries
import exampleQuery from './queries/exampleQuery'
import getCurrentUserQuery from './queries/getCurrentUserQuery'
import getPackageQuery from './queries/getPackageQuery'

// Export
export default {
  Query: {
    exampleQuery,
    getCurrentUser: getCurrentUserQuery,
    getPackageAndReviews: getPackageQuery,
  },
  Mutation: {
    exampleMutation,
    loginMutation,
    writeReview: writeReviewMutation,
  },
}
