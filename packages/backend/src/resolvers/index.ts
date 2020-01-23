// Mutations
import exampleMutation from './mutations/exampleMutation'
import loginMutation from './mutations/loginMutation'

// Queries
import exampleQuery from './queries/exampleQuery'

// Subscriptions
import newMail from './subscriptions/newMail'

// Export
export default {
  Query: {
    exampleQuery,
  },
  Mutation: {
    exampleMutation,
    loginMutation,
  },
  Subscription: {
    newMail,
  },
}
