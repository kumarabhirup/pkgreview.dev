// Mutations
import exampleMutation from './mutations/exampleMutation'
import loginMutation from './mutations/loginMutation'

// Queries
import exampleQuery from './queries/exampleQuery'
import getCurrentUserQuery from './queries/getCurrentUserQuery'

// Export
export default {
  Query: {
    exampleQuery,
    getCurrentUser: getCurrentUserQuery,
  },
  Mutation: {
    exampleMutation,
    loginMutation,
  },
}
