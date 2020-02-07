import { useMutation } from 'react-apollo'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import { Element, Link } from 'react-scroll'

import Block from './Block'
import Login, { LoginDynamic } from './Login'
import useUser from './hooks/useUser'
import StarRating from './StarRating'
import { placeholderUserImage } from '../api/meta'
import { ReviewTextbox } from '../lib/styles/styled'
import cookies from '../lib/cookies'
import { getRatingScore } from './PackageInfoBlock'

// eslint-disable-next-line import/no-cycle
import { GET_PACKAGE_AND_REVIEWS_QUERY } from '../../pages/npm/[pid]'

const WRITE_REVIEW_MUTATION = gql`
  mutation WRITE_REVIEW_MUTATION(
    $review: String!
    $rating: String! # RatingInput!
    $packageName: String!
    $currentUserToken: String!
  ) {
    writeReview(
      review: $review
      rating: $rating
      packageName: $packageName
      currentUserToken: $currentUserToken
    ) {
      id
      review
      rating
      # {
      #   score
      #   total
      # }
      author {
        id
        name
      }
    }
  }
`

export default function ComposeReviewBlock({
  packageSlug,
  existingReview,
  averagePackageRating,
  parentComponentRefetch,
}) {
  const router = useRouter()
  const { pid } = router.query

  const [{ avatar, username }, { userId }] = useUser()

  const [averageRatingScore] = getRatingScore(averagePackageRating)

  const [reviewText, setReviewText] = useState(existingReview?.review || '')

  const parsedRating = existingReview
    ? JSON.parse(existingReview?.rating)
    : null

  const [ratingScore, setRatingScore] = useState(
    parsedRating?.score || averageRatingScore || 3
  )

  const [mutationLoading, setMutationLoading] = useState(false)
  const [mutationError, setMutationError] = useState(false)
  const [mutationData, setMutationData] = useState(null)

  const packageName = pid

  const [writeReviewMutation] = useMutation(WRITE_REVIEW_MUTATION, {
    refetchQueries: () => [
      {
        query: GET_PACKAGE_AND_REVIEWS_QUERY,
        variables: {
          slug: encodeURIComponent(packageName),
          currentUserToken: cookies.get('pkgReviewText'),
        },
      },
    ],
    awaitRefetchQueries: true,
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

      {(() => {
        if (userId) {
          if (mutationData) return `Package Reviewed Successfully!`

          if (mutationLoading) return `Reviewing...`

          if (mutationError) return `Please write a review`

          return `${existingReview ? `Update` : `Post`} Your Review`
        }

        return '🔥 Sign In with GitHub to Post a review 🔥'
      })()}
    </>
  )

  return (
    <Element name="composeReview">
      <Block>
        <>
          <h1>Help others by reviewing this library</h1>

          <form method="post">
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
                  minLength={4}
                  maxLength={5000}
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
                type="submit"
                onClick={async e => {
                  e.preventDefault()

                  if (userId) {
                    setMutationLoading(true)
                    setMutationData(null)
                    setMutationError(false)

                    const { data, errors } = await writeReviewMutation({
                      variables: {
                        review: reviewText,
                        rating: JSON.stringify({
                          score: ratingScore,
                          total: 5,
                        }),
                        packageName,
                        currentUserToken: cookies.get('pkgReviewToken'),
                      },
                    })

                    if (data) {
                      setMutationLoading(false)
                      setMutationData(data?.writeReview)

                      router.replace(
                        `/npm/${encodeURIComponent(packageName).replace(
                          '%40',
                          '@'
                        )}`
                      )
                    }

                    if (errors) {
                      setMutationLoading(false)
                      setMutationError(true)
                    }
                  }
                }}
                disabled={reviewText.length < 3}
              >
                <InsideTheButton />
              </button>
            ) : (
              // <Link to="loginSection" smooth offset={-100} className="nextApp">
              <h2>Please Sign In to Post a Review</h2>
              // </Link>
            )}
          </form>
        </>
      </Block>
    </Element>
  )
}

ComposeReviewBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
  existingReview: PropTypes.object,
  averagePackageRating: PropTypes.number,
  parentComponentRefetch: PropTypes.func,
}
