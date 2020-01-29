/* eslint-disable @typescript-eslint/ban-ts-ignore */

import './utils/env'
import { GraphQLServer } from 'graphql-yoga'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as jwt from 'jsonwebtoken'
import * as MongoHeartbeat from 'mongo-heartbeat'

import typeDefs from './utils/schema'
import resolvers from './resolvers'
import pubsub from './utils/pubsub'
import db, { mongoDB } from './utils/database'
import userModel from './models/User'

const server: GraphQLServer = new GraphQLServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: (request): object => ({
    ...request,
    pubsub,
    db,
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

// Uptime Monitor for MongoDB
async function monitor(): Promise<void> {
  const heartBeat = MongoHeartbeat(await mongoDB(), {
    interval: 5000, // defaults to 5000 ms,
    timeout: 9000, // defaults to 10000 ms
    tolerance: 2, // defaults to 1 attempt
  })

  heartBeat.on('error', error => {
    console.error(
      `${new Date().toISOString()} - MongoDB didnt respond to the heartbeat message.`
    )
  })
}

monitor()

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
