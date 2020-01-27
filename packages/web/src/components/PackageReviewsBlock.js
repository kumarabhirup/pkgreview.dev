import React from 'react'
import PropTypes from 'prop-types'

import ReviewCard from './ReviewCard'

export default function PackageReviewsBlock({ packageReviews }) {
  return (
    <>
      {packageReviews.length > 0 && (
        <section className="reviewsBlock">
          <h1
            style={{
              display: 'inline-block',
              lineHeight: '10px',
              marginTop: '60px',
            }}
          >
            Reviews
          </h1>
          &nbsp;
          <span style={{ fontSize: '15px' }}>
            or just <a href="#composeReview">POST A REVIEW HERE</a>.
          </span>
          {packageReviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </section>
      )}
    </>
  )
}

PackageReviewsBlock.propTypes = {
  packageReviews: PropTypes.array.isRequired,
}
