/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as mongoose from 'mongoose'

import { ContextParameters } from 'graphql-yoga/dist/types'
import userModel from '../../models/User'

type Request = ContextParameters['request']

const getCurrentUserQuery = async (
  parent,
  args,
  { db, request }: { db: mongoose.Connection; request: Request },
  info
): Promise<object> => {
  // @ts-ignore
  if (!request.userId) {
    return null
  }

  // @ts-ignore
  const currentUser = await userModel.findById(request.userId)

  return currentUser
}

export default getCurrentUserQuery
