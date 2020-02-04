import React, { useState } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Link } from 'react-scroll'

const Wrapper = styled.div`
  .dv-star-rating {
    cursor: default !important;
  }

  .dv-star-rating-star {
    font-size: ${({ fontSize }) => fontSize || '60px'};
  }

  .star-untappable {
    color: red;
    display: block;
    font-size: 20px;
    line-height: 20px;
  }
`

export default function StarRating({
  fontSize,
  rating,
  starColor,
  emptyStarColor,
  isEditable,
  shouldShowNotEditableMessage,
  onRatingChange,
}) {
  const [ratingScore, setRatingScore] = useState(rating)
  const [hoverScore, setHoverScore] = useState(rating)

  const ChildComponent = () => (
    <Wrapper fontSize={fontSize}>
      <StarRatingComponent
        name="review" /* name of the radio input, it is required */
        value={
          ratingScore
        } /* number of selected icon (`0` - none, `1` - first) */
        starCount={5} /* number of icons in rating, default `5` */
        renderStarIcon={() => <span style={{ userSelect: 'none' }}>✯</span>}
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

  // return <Link {...{ to: 'composeReview', spy: true, smooth: true }}></Link>

  if (shouldShowNotEditableMessage === true) {
    return (
      <Link {...{ to: 'composeReview', spy: true, smooth: true }}>
        <ChildComponent />
      </Link>
    )
  }

  return <ChildComponent />
}

StarRating.defaultProps = {
  isEditable: false,
  shouldShowNotEditableMessage: false,
}

StarRating.propTypes = {
  fontSize: PropTypes.string,
  rating: PropTypes.number.isRequired,
  starColor: PropTypes.string,
  emptyStarColor: PropTypes.string,
  isEditable: PropTypes.bool,
  shouldShowNotEditableMessage: PropTypes.bool,
  onRatingChange: PropTypes.func,
}
