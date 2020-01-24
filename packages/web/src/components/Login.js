import React, { useState } from 'react'
import GitHubLogin from 'react-github-login'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'

import cookies from '../lib/cookies'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($codeForToken: String!) {
    loginMutation(codeForToken: $codeForToken) {
      _id
      name
      email
      token
      githubUsername
      createdAt
      updatedAt
    }
  }
`

export default function Login() {
  const [codeForToken, setCodeForToken] = useState(null)
  const [userToken, setUserToken] = useState(null)

  const router = useRouter()

  const [signInMutation, mutationData] = useMutation(SIGNIN_MUTATION, {
    variables: {
      codeForToken,
    },
  })

  return (
    <GitHubLogin
      clientId={process.env.PR_GITHUB_CLIENT_ID}
      className="loginText underline pointer"
      buttonText="Sign In with GitHub 😻 to Post and Moderate reviews"
      redirectUri=""
      scope="read:user"
      onSuccess={async ({ code }) => {
        await setCodeForToken(code)

        const mutation = await signInMutation()

        if (mutation.data.loginMutation.token) {
          setUserToken(mutation.data.loginMutation.token)

          cookies.set('pkgReviewToken', mutation.data.loginMutation.token, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 9,
          })

          router.reload()
        }
      }}
      onFailure={() => {
        // Fail Silently, Gracefully.
      }}
    />
  )
}
