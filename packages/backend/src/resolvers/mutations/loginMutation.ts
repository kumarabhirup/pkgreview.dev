/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'

import { Context, ContextParameters } from 'graphql-yoga/dist/types'
import userModel from '../../models/User'

type Response = ContextParameters['response']

const loginMutation = async (
  parent,
  { codeForToken }: { codeForToken: string },
  { db, response }: { db: mongoose.Connection; response: Response },
  info
): Promise<any> => {
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

  const {
    id,
    email,
    name,

    // This is the GitHub Username
    login,
  } = user

  // Check if user already exists, if yes, just generate the token...
  const isUserAlreadySignedIn = await userModel.findOne({ githubId: id })

  const time = new Date().toISOString()

  let mutateUser

  if (isUserAlreadySignedIn) {
    // Save the User to the Database
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
  } else {
    mutateUser = await userModel.findOneAndUpdate(
      { githubId: id },
      { updatedAt: time }
    )
  }

  const token = jwt.sign(
    { userId: mutateUser._id.toString() },
    process.env.PR_JWT_SECRET
  )

  response.cookie('pkgreviewToken', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  })

  return { ...mutateUser.toObject(), _id: mutateUser._id.toString() }
}

export default loginMutation
