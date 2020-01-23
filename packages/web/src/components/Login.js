import React, { useState } from 'react'
import GitHubLogin from 'react-github-login'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import { CURRENT_USER_QUERY } from './ProvideUser'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($codeForToken: String!) {
    loginMutation(codeForToken: $codeForToken) {
      _id
      name
      email
      githubUsername
      createdAt
      updatedAt
    }
  }
`

export default function Login() {
  const [codeForToken, setCodeForToken] = useState(null)

  const [signInMutation, { loading, data, error }] = useMutation(
    SIGNIN_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      variables: {
        codeForToken,
      },
    }
  )

  return (
    <GitHubLogin
      clientId={process.env.PR_GITHUB_CLIENT_ID}
      className="loginText"
      buttonText="Sign In with GitHub 😻 to Post and Moderate reviews"
      redirectUri=""
      scope="read:user"
      onSuccess={async ({ code }) => {
        await setCodeForToken(code)

        signInMutation()
      }}
      onFailure={() => {
        // Fail Silently, Gracefully.
      }}
    />
  )
}
