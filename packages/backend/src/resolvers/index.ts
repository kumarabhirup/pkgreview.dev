// Mutations
import exampleMutation from './mutations/exampleMutation'
import loginMutation from './mutations/loginMutation'

// Queries
import exampleQuery from './queries/exampleQuery'
import getCurrentUserQuery from './queries/getCurrentUserQuery'
import getPackageQuery from './queries/getPackageQuery'

// Export
export default {
  Query: {
    exampleQuery,
    getCurrentUser: getCurrentUserQuery,
    getPackage: getPackageQuery,
  },
  Mutation: {
    exampleMutation,
    loginMutation,
  },
}
