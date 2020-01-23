import './utils/env'
import { GraphQLServer } from 'graphql-yoga'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as jwt from 'jsonwebtoken'

import typeDefs from './utils/schema'
import resolvers from './resolvers'
import pubsub from './utils/pubsub'
import db from './utils/database'
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

// Decode the JWT
server.express.use((req, res, next) => {
  const pkgreviewToken = req?.cookies?.pkgreviewToken

  if (pkgreviewToken) {
    const { userId } = jwt.verify(pkgreviewToken, process.env.PR_JWT_SECRET)
    if (userId) {
      // @ts-ignore
      req.userId = userId
    }
  }

  next()
})

// Populate the user
server.express.use(async (req, res, next) => {
  // skip if they aren't logged in

  // @ts-ignore
  if (!req.userId) {
    return next()
  }

  // @ts-ignore
  const user = await userModel.findById(req.userId).select('id name email githubUsername')

  // @ts-ignore
  req.user = user

  next()
})

// Port
const PORT = 4000

// Routes
server.start(
  {
    endpoint: '/api/graphql',
    cacheControl: false,
    port: PORT,
  },
  details => console.log(`GraphQL Server is running on PORT ${details.port}`)
)
