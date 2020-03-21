/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as jwt from 'jsonwebtoken'

import { Prisma } from 'prisma-binding'
import { ContextParameters } from 'graphql-yoga/dist/types'

type Request = ContextParameters['request']

const getCurrentUserQuery = async (
  parent,
  { token }: { token: string },
  { request, db }: { request: Request; db: Prisma },
  info
): Promise<object | null> => {
  let userId

  try {
    // eslint-disable-next-line prefer-destructuring
    if (token) userId = jwt.verify(token, process.env.PR_JWT_SECRET)?.userId
  } catch (error) {
    userId = null
  }

  // @ts-ignore
  if (request) request.userId = userId

  if (userId) {
    // const currentUser = await db.user({ id: userId })
    const currentUser = await db.query.user({ where: { id: userId } }, info)

    return currentUser
  }

  return null
}

export default getCurrentUserQuery
