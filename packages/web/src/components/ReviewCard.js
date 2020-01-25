import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { FlexContainer } from '../lib/styles/styled'
import Center from './Center'
import StarRating from './StarRating'

export default function ReviewCard({ review }) {
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    // fetch github user avatar
    ;(async () => {
      const response = await axios
        .get(`https://api.github.com/user/${review.author.githubId}`)
        .then(({ data }) => data)

      // eslint-disable-next-line camelcase
      setAvatar(response?.avatar_url)
      setUsername(response?.login)
    })()
  }, [review.author.githubId, review.author.githubUsername])

  return (
    <article
      className="block accent fixed"
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
              src={
                avatar ||
                'https://react.semantic-ui.com/images/avatar/small/joe.jpg'
              }
              alt="Profile"
              width="125"
              style={{ borderRadius: '100%' }}
            />

            <h1>
              {username ? (
                <a
                  style={{ color: '#fff' }}
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {review.author.name}
                </a>
              ) : (
                review.author.name
              )}
            </h1>

            <StarRating
              rating={review?.rating?.score}
              starColor="#eaeaea"
              emptyStarColor="#273b7c"
              fontSize="50px"
            />
          </Center>
        </div>

        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: '20px' }}>{review.review}</p>
        </div>
      </FlexContainer>
    </article>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
}
