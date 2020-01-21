import React from 'react'
import PropTypes from 'prop-types'

import { Body } from '../lib/styles/styled'
import Center from './Center'

export default function Block({ children }) {
  return (
    <Body className="block fixed">
      <Center>{children}</Center>
    </Body>
  )
}

Block.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
}
