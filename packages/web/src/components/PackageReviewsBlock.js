import React from 'react'
import PropTypes from 'prop-types'

import ReviewCard from './ReviewCard'

export default function PackageReviewsBlock({ packageReviews }) {
  return (
    <>
      {packageReviews.length > 0 && (
        <section className="reviewsBlock">
          <h1>Reviews</h1>

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
