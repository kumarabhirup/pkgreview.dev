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

        {[1].map(review => (
          <article
            className="block accent"
            style={{ padding: '10px', marginTop: '40px' }}
          >
            <FlexContainer
              firstWidth="35%"
              lastWidth="65%"
              style={{ textAlign: 'start' }}
            >
              <div
                style={{
                  padding: '20px 0px',
                }}
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
                    fontSize="50px"
                  />
                </Center>
              </div>

              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '20px' }}>
                  This is a very small demo review. This is how things will
                  kinda look like.
                </p>
              </div>
            </FlexContainer>
          </article>
        ))}
      </section>
    </>
  )
}

PackageReviewsBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
}
