import { useMutation } from 'react-apollo'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import Block from './Block'
import Login from './Login'
import useUser from './hooks/useUser'
import StarRating from './StarRating'
import { placeholderUserImage } from '../api/meta'
import { ReviewTextbox } from '../lib/styles/styled'
import extractPackageNameFromSlug from '../lib/extractPackageNameFromSlug'
import cookies from '../lib/cookies'

// eslint-disable-next-line import/no-cycle
import { GET_PACKAGE_AND_REVIEWS_QUERY } from '../../pages/npm/[pid]'

const WRITE_REVIEW_MUTATION = gql`
  mutation WRITE_REVIEW_MUTATION(
    $review: String!
    $rating: RatingInput!
    $packageName: String!
    $currentUserToken: String!
  ) {
    writeReview(
      review: $review
      rating: $rating
      packageName: $packageName
      currentUserToken: $currentUserToken
    ) {
      _id
      review
      rating {
        score
        total
      }
      author {
        _id
        name
      }
    }
  }
`

export default function ComposeReviewBlock({ packageSlug, existingReview }) {
  const [{ avatar, username }, { userId }] = useUser()

  const [reviewText, setReviewText] = useState(existingReview?.review || '')
  const [ratingScore, setRatingScore] = useState(
    existingReview?.rating?.score || 0
  )

  const [mutationLoading, setMutationLoading] = useState(false)
  const [mutationData, setMutationData] = useState(null)

  const packageName = extractPackageNameFromSlug(packageSlug)

  const [writeReviewMutation] = useMutation(WRITE_REVIEW_MUTATION, {
    refetchQueries: [
      {
        query: GET_PACKAGE_AND_REVIEWS_QUERY,
        variables: {
          slug: packageName,
          currentUserToken: cookies.get('pkgReviewText'),
        },
      },
    ],
  })

  const InsideTheButton = () => (
    <>
      <img
        src={avatar || placeholderUserImage}
        width="50px"
        alt={`${username || 'User'}'s Profile`}
        style={{ borderRadius: '100%' }}
      />
      <br />
      {/* {userId
        ? `${existingReview ? `Update` : `Post`} Your Review`
        : '🔥 Sign In with GitHub to Post a review 🔥'} */}
      {(() => {
        if (userId) {
          if (mutationData) return `Package Reviewed Successfully!`

          if (mutationLoading) return `Reviewing...`

          return `${existingReview ? `Update` : `Post`} Your Review`
        }

        return '🔥 Sign In with GitHub to Post a review 🔥'
      })()}
    </>
  )

  return (
    <Block id="composeReview">
      <h1>Help others by reviewing this library</h1>

      {userId && (
        <>
          <StarRating
            rating={ratingScore}
            onRatingChange={rating => setRatingScore(rating)}
            isEditable
          />

          <ReviewTextbox
            placeholder={`Write your review about '${packageName}' here...`}
            value={reviewText}
            disabled={!userId}
            onChange={e => {
              setReviewText(e.target.value)
            }}
          />
        </>
      )}

      {userId ? (
        <button
          className="block accent"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            fontSize: '20px',
          }}
          type="button"
          onClick={async () => {
            if (userId) {
              setMutationLoading(true)
              setMutationData(null)

              const { data } = await writeReviewMutation({
                variables: {
                  review: reviewText,
                  rating: {
                    score: ratingScore,
                    total: 5,
                  },
                  packageName,
                  currentUserToken: cookies.get('pkgReviewToken'),
                },
              })

              if (data) {
                setMutationLoading(false)
                setMutationData(data?.writeReview)
              }
            }
          }}
        >
          <InsideTheButton />
        </button>
      ) : (
        <Login
          buttonText={<InsideTheButton />}
          className="block accent reviewLoginButton"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            fontSize: '20px',
          }}
        />
      )}
    </Block>
  )
}

ComposeReviewBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
  existingReview: PropTypes.object,
}
