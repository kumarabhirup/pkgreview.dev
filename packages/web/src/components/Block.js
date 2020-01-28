import React from 'react'
import PropTypes from 'prop-types'

import { Body } from '../lib/styles/styled'
import Center from './Center'

export default function Block(props) {
  const { children, className } = props

  return (
    <Body {...props} className={`block fixed blockSelecter ${className}`}>
      <Center>{children}</Center>
    </Body>
  )
}

Block.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  className: PropTypes.string,
}
