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
import getPackageQuery from './resolvers/queries/getPackageQuery'

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

// pkgreview.dev API
const database: Prisma = server.context().db

server.express.get('/api/v1/:pkgManager/:pkgName', async (req, res) => {
  const pkgManager = req?.params?.pkgManager

  const pkgName = encodeURIComponent(req?.params?.pkgName)

  let pkgInformation
  try {
    pkgInformation = await getPackageQuery(
      null,
      { currentUserToken: null, type: pkgManager, slug: pkgName },
      { context: server.context(), db: database },
      null
    )
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error.message,
    })

    return
  }

  const score: number | null = pkgInformation?.rating
    ? Math.floor(pkgInformation?.rating * 5) // score out of 5
    : null

  let starString: string | null = score ? `` : null

  if (starString !== null) {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 5; i++) {
      if (i <= score) {
        starString += `★`
      } else {
        starString += `☆`
      }
    }
  }

  res.status(200).send({
    name: decodeURIComponent(pkgName),
    type: pkgManager,

    // @ts-ignore
    reviewsCount: pkgInformation?.reviews?.length,

    // @ts-ignore
    rating: pkgInformation?.rating,

    icon: pkgManager,
    starString,
  })
})

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
