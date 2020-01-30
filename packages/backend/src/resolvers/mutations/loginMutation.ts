/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'

import { ContextParameters } from 'graphql-yoga/dist/types'
import userModel from '../../models/User'

type Response = ContextParameters['response']

const loginMutation = async (
  parent,
  { codeForToken }: { codeForToken: string },
  { db, response }: { db: mongoose.Connection; response: Response },
  info
): Promise<object> => {
  let user

  try {
    const accessToken = await axios
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.PR_GITHUB_CLIENT_ID,
          client_secret: process.env.PR_GITHUB_CLIENT_SECRET,
          code: codeForToken,
        },
        { headers: { Accept: 'application/json' } }
      )
      .then(({ data }) => data.access_token)

    user = await axios
      .get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` },
      })
      .then(({ data }) => data)
  } catch (error) {
    throw new Error(error.message)
  }

  const id = user?.id
  const email = user?.email
  const name = user?.name
  const login = user?.login

  // Check if user already exists, if yes, just generate the token...
  const isUserAlreadySignedIn = await userModel.findOne({ githubId: id })

  const time = new Date().toISOString()

  let mutateUser

  if (await isUserAlreadySignedIn) {
    mutateUser = await userModel
      .findOneAndUpdate({ githubId: id }, { updatedAt: time })
      .exec()
  } else {
    mutateUser = await userModel
      .insertMany([
        {
          name,
          email,
          githubUsername: login,
          githubId: id,
          createdAt: time,
          updatedAt: time,
        },
      ])
      .then(data => data[0])
  }

  const refreshedUserInfo = await userModel
    .findById(mutateUser?._id?.toString())
    .then(data => data.toObject())

  const token = jwt.sign(
    { userId: refreshedUserInfo?._id?.toString() },
    process.env.PR_JWT_SECRET,
    { expiresIn: '10d' }
  )

  return {
    ...refreshedUserInfo,
    _id: refreshedUserInfo?._id?.toString(),
    token,
  }
}

export default loginMutation
