/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'

import userModel from '../../models/User'
import { Context, ContextParameters } from 'graphql-yoga/dist/types'

type Response = ContextParameters["response"]

const loginMutation = async (
  parent,
  { codeForToken }: { codeForToken: string },
  { db, response }: { db: mongoose.Connection, response: Response },
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
    email,
    name,

    // This is the GitHub Username
    login,
  } = user

  // Save the User to the Database
  const saveUser = await userModel
    .insertMany([{ name, email, githubUsername: login }])
    .then(data => data[0])

  const token = jwt.sign({ userId: saveUser._id.toString() }, process.env.PR_JWT_SECRET)
  
  response.cookie('pkgreviewToken', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
  })

  return {...saveUser.toObject(), _id: saveUser._id.toString()}
}

export default loginMutation
