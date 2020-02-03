/* eslint-disable @typescript-eslint/ban-ts-ignore */

import './utils/env'
import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

import typeDefs from './utils/schema'
import { typeDefs as prismaTypedefs } from './utils/prisma-client/prisma-schema'
import resolvers from './resolvers'
import pubsub from './utils/pubsub'

const server: GraphQLServer = new GraphQLServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: (request): object => ({
    ...request,
    pubsub,
    db: new Prisma({
      typeDefs: prismaTypedefs,
      endpoint: process.env.PR_DB_ENDPOINT,
      secret: process.env.PR_JWT_SECRET,
      debug: false,
    }),
  }),
})

server.use(cookieParser())

server.use(bodyParser.json({ limit: '50mb' }))

server.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)

// Port
const PORT = 4000

// Routes
server.start(
  {
    endpoint: '/api/graphql',
    port: PORT,
  },
  details => console.log(`GraphQL Server is running on PORT ${details.port}`)
)
