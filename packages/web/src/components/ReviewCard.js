import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useMutation, useApolloClient } from 'react-apollo'
import gql from 'graphql-tag'

import cookies from '../lib/cookies'
import { FlexContainer } from '../lib/styles/styled'
import Center from './Center'
import StarRating from './StarRating'
import { getCurrentUser } from './ProvideUser'

const FLAG_REVIEW_MUTATION = gql`
  mutation FLAG_REVIEW_MUTATION(
    $reviewId: String!
    $currentUserToken: String!
  ) {
    flagReview(reviewId: $reviewId, currentUserToken: $currentUserToken) {
      _id
      by {
        _id
      }
      review {
        _id
      }
    }
  }
`

export default function ReviewCard({ review }) {
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState(null)

  const [userId, setUserId] = useState(null)

  // null - not flagged, true - flagged, false - error
  const [isFlagged, setIsFlagged] = useState(null)
  const [isFlagLoading, setIsFlagLoading] = useState(false)

  const client = useApolloClient()

  const [flagReviewMutation, flagReviewMutationData] = useMutation(
    FLAG_REVIEW_MUTATION
  )

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

    // fetch user id
    ;(async () => {
      const user = await getCurrentUser(client)

      if (user?.data?.getCurrentUser?._id) {
        setUserId(user?.data?.getCurrentUser?._id)
      }
    })()
  }, [client, review.author.githubId, review.author.githubUsername])

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

            {userId && (
              <h6>
                {review?.author?._id === userId ? (
                  `This is your review`
                ) : (
                  <button
                    className="block"
                    style={{ padding: '5px' }}
                    onClick={async () => {
                      const thisFlagReviewMutation = await flagReviewMutation({
                        variables: {
                          reviewId: review._id,
                          currentUserToken: cookies.get('pkgReviewToken'),
                        },
                      })

                      if (thisFlagReviewMutation?.data?.flagReview?._id) {
                        setIsFlagged(true)
                      }
                    }}
                    disabled={isFlagged || isFlagLoading}
                    type="button"
                  >
                    {isFlagged ? `Reported! Thanks :)` : `Report 🚩`}
                    {isFlagLoading && `Loading...`}
                  </button>
                )}
              </h6>
            )}
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
