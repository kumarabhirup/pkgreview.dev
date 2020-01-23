import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import cookies from '../lib/cookies'

export default function SignOut({ children }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        cookies.remove('pkgReviewToken', { path: '/' })
        router.reload()
      }}
    >
      {children}
    </button>
  )
}

SignOut.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
}
