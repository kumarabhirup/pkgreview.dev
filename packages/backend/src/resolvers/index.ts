// Mutations
import exampleMutation from './mutations/exampleMutation'

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
  },
  Subscription: {
    newMail,
  },
}
