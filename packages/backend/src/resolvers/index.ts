// Mutations
import exampleMutation from './mutations/exampleMutation'
import loginMutation from './mutations/loginMutation'

// Queries
import exampleQuery from './queries/exampleQuery'
import getCurrentUserQuery from './queries/getCurrentUserQuery'

// Subscriptions
import newMail from './subscriptions/newMail'

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
  Subscription: {
    newMail,
  },
}
