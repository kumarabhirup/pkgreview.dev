import React, { useState } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  .dv-star-rating {
    cursor: default !important;
  }

  .dv-star-rating-star {
    font-size: ${({ fontSize }) => fontSize || '60px'};
  }
`

export default function StarRating({
  fontSize,
  rating,
  starColor,
  emptyStarColor,
  isEditable,
  onRatingChange,
}) {
  const [ratingScore, setRatingScore] = useState(rating)
  const [hoverScore, setHoverScore] = useState(rating)

  return (
    <Wrapper fontSize={fontSize}>
      <StarRatingComponent
        name="review" /* name of the radio input, it is required */
        value={
          ratingScore
        } /* number of selected icon (`0` - none, `1` - first) */
        starCount={5} /* number of icons in rating, default `5` */
        renderStarIcon={() => `✯`}
        starColor={starColor || '#4f78ff'}
        emptyStarColor={emptyStarColor || '#eaeaea'}
        onStarClick={(nextValue, prevValue, name) => {
          setRatingScore(hoverScore)
          onRatingChange(hoverScore)
        }}
        onStarHover={(nextValue, prevValue, name) => {
          setHoverScore(nextValue)
        }}
        editing={isEditable}
      />
    </Wrapper>
  )
}

StarRating.defaultProps = {
  isEditable: false,
}

StarRating.propTypes = {
  fontSize: PropTypes.string,
  rating: PropTypes.number.isRequired,
  starColor: PropTypes.string,
  emptyStarColor: PropTypes.string,
  isEditable: PropTypes.bool,
  onRatingChange: PropTypes.func,
}
