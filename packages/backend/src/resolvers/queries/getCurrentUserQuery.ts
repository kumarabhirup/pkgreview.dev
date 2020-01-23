/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'

import { ContextParameters } from 'graphql-yoga/dist/types'
import userModel from '../../models/User'

type Request = ContextParameters['request']

const getCurrentUserQuery = async (
  parent,
  { token }: { token: string },
  { db, request }: { db: mongoose.Connection; request: Request },
  info
): Promise<object> => {
  let userId

  // eslint-disable-next-line prefer-destructuring
  if (token) userId = jwt.verify(token, process.env.PR_JWT_SECRET).userId

  // @ts-ignore
  request.userId = userId

  if (userId) {
    const currentUser = await userModel.findById(userId)

    return currentUser
  }

  return null
}

export default getCurrentUserQuery
