import React from 'react'
import PropTypes from 'prop-types'

import Block from './Block'
import StarRating from './StarRating'
import { ReviewTextbox } from '../lib/styles/styled'
import extractPackageNameFromSlug from '../lib/extractPackageNameFromSlug'

export default function ComposeReviewBlock({ packageSlug }) {
  return (
    <Block>
      <h1>Help others by reviewing this library</h1>

      <StarRating rating={4} />

      <ReviewTextbox
        placeholder={`Write your review about ${extractPackageNameFromSlug(
          packageSlug
        )} here...`}
      />

      <button
        className="block accent"
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          fontSize: '20px',
        }}
        type="submit"
      >
        <img
          src="https://react.semantic-ui.com/images/avatar/small/joe.jpg"
          alt="Profile"
          style={{ borderRadius: '100%' }}
        />
        <br />
        Post Your Review
      </button>
    </Block>
  )
}

ComposeReviewBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
}
