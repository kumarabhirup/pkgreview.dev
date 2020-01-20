import React from 'react'
import PropTypes from 'prop-types'

import { Body } from '../lib/styles/styled'

export default function MainUi({ children }) {
  return (
    <Body className="block fixed">
      <center className="i-used-center-tag-forgive-me-please-dont-kill-me">
        {children}
      </center>
    </Body>
  )
}

MainUi.propTypes = {
  children: PropTypes.element.isRequired,
}
