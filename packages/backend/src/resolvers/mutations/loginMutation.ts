/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import { Prisma } from 'prisma-binding'

import { ContextParameters } from 'graphql-yoga/dist/types'

type Response = ContextParameters['response']

const loginMutation = async (
  parent,
  { codeForToken }: { codeForToken: string },
  { db, response }: { db: Prisma; response: Response },
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

    user.email = await axios
    .get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then(({ data }) => data.filter(email => email.primary === true)[0].email)
  } catch (error) {
    throw new Error(`${error.message}`)
  }

  const id = user?.id
  const email = user?.email
  const name = user?.name || user?.login
  const login = user?.login

  // Check if user already exists, if yes, just generate the token...
  const isUserAlreadySignedIn = await db.query.user(
    { where: { githubId: id } },
    info
  )

  const time = new Date().toISOString()

  let mutateUser

  if (await isUserAlreadySignedIn) {
    mutateUser = await db.mutation.updateUser(
      {
        where: { githubId: id },
        data: {},
      },
      info
    )
  } else {
    mutateUser = await db.mutation.createUser(
      {
        data: { name, email, githubUsername: login, githubId: id },
      },
      info
    )
  }

  const refreshedUserInfo = await db.query.user(
    {
      where: { id: mutateUser?.id?.toString() },
    },
    info
  )

  const token = jwt.sign(
    { userId: refreshedUserInfo?.id?.toString() },
    process.env.PR_JWT_SECRET,
    { expiresIn: '10d' }
  )

  return {
    ...refreshedUserInfo,
    id: refreshedUserInfo?.id?.toString(),
    token,
  }
}

export default loginMutation
