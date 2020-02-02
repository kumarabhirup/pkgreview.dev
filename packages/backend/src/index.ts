/* eslint-disable @typescript-eslint/ban-ts-ignore */

import './utils/env'
import { GraphQLServer } from 'graphql-yoga'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

import typeDefs from './utils/schema'
import resolvers from './resolvers'
import pubsub from './utils/pubsub'
import { prisma } from '../generated/prisma-client'

const server: GraphQLServer = new GraphQLServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: (request): object => ({
    ...request,
    pubsub,
    db: prisma,
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
