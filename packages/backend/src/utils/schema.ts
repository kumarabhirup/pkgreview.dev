const typeDefs = `
  # Bmc Configuration Settings
  input BmcCredential {
    email: String!
    password: String!
    host: String!
    port: Int!
    secureConnection: Boolean!
    proxy: String
  }

  input BmcAttachment {
    filename: String!
    path: String!
  }

  input BmcMailSettings {
    subject: String!
    from: String!
    to: String! # This should be stringified version of json object that contains the CsvData.
    theme: String! # This should be stringified version of an HTML document.
    attachments: [BmcAttachment]
  }

  input BmcConfigurations {
    mailInterval: String
    verbose: Boolean
  }

  input BmcNonUserData {
    sentTo: [String]!
  }

  input BmcMasterConfiguration {
    credentials: BmcCredential!
    mail: BmcMailSettings!
    configuration: BmcConfigurations
    nonUserData: BmcNonUserData
  }

  # Returned data after Mails Sent
  type MailSentResponse {
    message: String!
    channelHash: String!
  }

  # Returned data after newMail received
  type NewMailResponse {
    email: String!
    channelHash: String!
  }

  # Mutations
  type Mutation {
    exampleMutation: String
    sendMails(
      configuration: BmcMasterConfiguration
      shouldRestart: Boolean = false
    ): MailSentResponse!
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
