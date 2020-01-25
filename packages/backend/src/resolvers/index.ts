// Mutations
import exampleMutation from './mutations/exampleMutation'
import loginMutation from './mutations/loginMutation'
import writeReviewMutation from './mutations/writeReviewMutation'
import flagReviewMutation from './mutations/flagReviewMutation'

// Queries
import exampleQuery from './queries/exampleQuery'
import getCurrentUserQuery from './queries/getCurrentUserQuery'
import getPackageQuery from './queries/getPackageQuery'
import searchPackageQuery from './queries/searchPackageQuery'

// Export
export default {
  Query: {
    exampleQuery,
    getCurrentUser: getCurrentUserQuery,
    getPackageAndReviews: getPackageQuery,
    searchPackage: searchPackageQuery,
  },
  Mutation: {
    exampleMutation,
    loginMutation,
    writeReview: writeReviewMutation,
    flagReview: flagReviewMutation,
  },
}
