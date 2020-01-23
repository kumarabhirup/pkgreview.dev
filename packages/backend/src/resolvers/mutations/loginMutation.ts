/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as mongoose from 'mongoose'
import axios from 'axios'

import userModel from '../../models/User'

const loginMutation = async (
  parent,
  { codeForToken }: { codeForToken: string },
  { db }: { db: mongoose.Connection },
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

  return saveUser
}

export default loginMutation
