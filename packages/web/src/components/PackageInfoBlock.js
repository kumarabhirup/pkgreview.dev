import React from 'react'
import PropTypes from 'prop-types'

import Block from './Block'
import StarRating from './StarRating'
import { FlexContainer } from '../lib/styles/styled'
import extractPackageNameFromSlug from '../lib/extractPackageNameFromSlug'

export default function PackageInfoBlock({ packageSlug }) {
  return (
    <Block>
      <FlexContainer lastTextAlign>
        <div>
          <h1 style={{ textAlign: 'start' }}>
            {extractPackageNameFromSlug(packageSlug)}{' '}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg"
              width="50"
              alt="Npm Package Review"
            />
          </h1>

          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>

          <p>
            <h3>Version</h3> v2.0.0
          </p>

          <p>
            <h3>Author</h3> Kumar Abhirup
          </p>

          <p>
            <h3>Rating</h3> 4/5 (1 review)
          </p>
        </div>

        <h1>
          <StarRating rating={4} />
        </h1>
      </FlexContainer>
    </Block>
  )
}

PackageInfoBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
}
