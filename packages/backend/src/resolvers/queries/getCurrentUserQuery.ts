/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as jwt from 'jsonwebtoken'

import { ContextParameters } from 'graphql-yoga/dist/types'
import userModel from '../../models/User'

type Request = ContextParameters['request']

const getCurrentUserQuery = async (
  parent,
  { token }: { token: string },
  { request }: { request: Request },
  info
): Promise<object | null> => {
  let userId

  // eslint-disable-next-line prefer-destructuring
  if (token) userId = jwt.verify(token, process.env.PR_JWT_SECRET).userId

  // @ts-ignore
  if (request) request.userId = userId

  if (userId) {
    const currentUser = await userModel
      .findById(userId)
      .then(data => data.toObject())

    return currentUser
  }

  return null
}

export default getCurrentUserQuery
