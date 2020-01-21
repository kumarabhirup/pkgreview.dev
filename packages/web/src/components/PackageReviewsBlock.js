import React from 'react'
import PropTypes from 'prop-types'

import { FlexContainer } from '../lib/styles/styled'
import Center from './Center'
import StarRating from './StarRating'

export default function PackageReviewsBlock({ packageSlug }) {
  return (
    <>
      <section className="reviewsBlock">
        <h1>Reviews</h1>

        <article className="block accent" style={{ padding: '10px' }}>
          <FlexContainer
            firstWidth="30%"
            lastWidth="70%"
            style={{ textAlign: 'start' }}
          >
            <div
              style={{ padding: '20px 0px', borderRight: '1px solid #ffffff' }}
            >
              <Center>
                <img
                  src="https://react.semantic-ui.com/images/avatar/small/joe.jpg"
                  alt="Profile"
                  width="125"
                  style={{ borderRadius: '100%' }}
                />

                <h1>Kumar Abhirup</h1>

                <StarRating
                  rating={4}
                  starColor="#eaeaea"
                  emptyStarColor="#273b7c"
                />
              </Center>
            </div>
            <div style={{ padding: '20px' }}>Hi</div>
          </FlexContainer>
        </article>
      </section>
    </>
  )
}

PackageReviewsBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
}
