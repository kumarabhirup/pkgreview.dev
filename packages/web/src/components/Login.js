import React, { useState } from 'react'
import GitHubLogin from 'react-github-login'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import SocialLogin from 'react-social-login'
import PropTypes from 'prop-types'

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

const PrimitiveSocialButton = props => {
  // eslint-disable-next-line react/prop-types
  const { children, triggerLogin } = props

  return (
    <button onClick={triggerLogin} {...props} type="button">
      {children}
    </button>
  )
}

export const SocialButton = SocialLogin(PrimitiveSocialButton)

export default function Login({ buttonText, className, style }) {
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
      className={className ?? `loginText underline pointer`}
      style={style}
      buttonText={
        buttonText || 'Sign In with GitHub 😻 to Post and Moderate reviews'
      }
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

Login.propTypes = {
  buttonText: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
}
