import React from 'react'
import PropTypes from 'prop-types'

export default function Center({ children }) {
  return (
    <center className="i-used-center-tag-forgive-me-please-dont-kill-me">
      {children}
    </center>
  )
}

Center.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
}
