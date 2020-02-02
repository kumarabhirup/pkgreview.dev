/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as jwt from 'jsonwebtoken'

import { ContextParameters } from 'graphql-yoga/dist/types'
import { Prisma } from '../../../generated/prisma-client'

type Request = ContextParameters['request']

const getCurrentUserQuery = async (
  parent,
  { token }: { token: string },
  { request, db }: { request: Request; db: Prisma },
  info
): Promise<object | null> => {
  let userId

  // eslint-disable-next-line prefer-destructuring
  if (token) userId = jwt.verify(token, process.env.PR_JWT_SECRET).userId

  // @ts-ignore
  if (request) request.userId = userId

  if (userId) {
    // const currentUser = await userModel
    //   .findById(userId)
    //   .then(data => data.toObject())

    const currentUser = await db.user({ id: userId })

    return currentUser
  }

  return null
}

export default getCurrentUserQuery
