import React from 'react'
import StarRatingComponent from 'react-star-rating-component'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  .dv-star-rating-star {
    font-size: ${({ fontSize }) => fontSize || '60px'};
  }
`

export default function StarRating({
  fontSize,
  rating,
  starColor,
  emptyStarColor,
}) {
  return (
    <Wrapper fontSize={fontSize}>
      <StarRatingComponent
        name="review" /* name of the radio input, it is required */
        value={rating} /* number of selected icon (`0` - none, `1` - first) */
        starCount={5} /* number of icons in rating, default `5` */
        renderStarIcon={() => `⭑`}
        starColor={starColor || '#4f78ff'}
        emptyStarColor={emptyStarColor || '#eaeaea'}
      />
    </Wrapper>
  )
}

StarRating.propTypes = {
  fontSize: PropTypes.string,
  rating: PropTypes.number.isRequired,
  starColor: PropTypes.string,
  emptyStarColor: PropTypes.string,
}
