// Mutations
import exampleMutation from './mutations/exampleMutation'
import sendMails from './mutations/sendMails'

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
    sendMails,
  },
  Subscription: {
    newMail,
  },
}
