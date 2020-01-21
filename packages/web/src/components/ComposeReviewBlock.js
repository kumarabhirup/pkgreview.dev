import React from 'react'
import PropTypes from 'prop-types'

import Block from './Block'
import StarRating from './StarRating'
import { FlexContainer } from '../lib/styles/styled'
import extractPackageNameFromSlug from '../lib/extractPackageNameFromSlug'

export default function ComposeReviewBlock({ packageSlug }) {
  return (
    <Block>
      <textarea />
    </Block>
  )
}

ComposeReviewBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
}
