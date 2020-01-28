import { useMutation } from 'react-apollo'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'

import Block from './Block'
import Login from './Login'
import useUser from './hooks/useUser'
import StarRating from './StarRating'
import { placeholderUserImage } from '../api/meta'
import { ReviewTextbox } from '../lib/styles/styled'
import extractPackageNameFromSlug from '../lib/extractPackageNameFromSlug'
import cookies from '../lib/cookies'
import { getRatingScore } from './PackageInfoBlock'

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

export default function ComposeReviewBlock({
  packageSlug,
  existingReview,
  averagePackageRating,
  parentComponentRefetch,
}) {
  const router = useRouter()

  const [{ avatar, username }, { userId }] = useUser()

  const [averageRatingScore] = getRatingScore(averagePackageRating)

  const [reviewText, setReviewText] = useState(existingReview?.review || '')
  const [ratingScore, setRatingScore] = useState(
    existingReview?.rating?.score || averageRatingScore || 3
  )

  const [mutationLoading, setMutationLoading] = useState(false)
  const [mutationError, setMutationError] = useState(false)
  const [mutationData, setMutationData] = useState(null)

  const packageName = extractPackageNameFromSlug(packageSlug)

  const [writeReviewMutation] = useMutation(WRITE_REVIEW_MUTATION, {
    refetchQueries: () => [
      {
        query: GET_PACKAGE_AND_REVIEWS_QUERY,
        variables: {
          slug: packageName,
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
    <Block id="composeReview">
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

                    router.replace(`/npm/${packageName}`)
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
        </form>
      </>
    </Block>
  )
}

ComposeReviewBlock.propTypes = {
  packageSlug: PropTypes.string.isRequired,
  existingReview: PropTypes.object,
  averagePackageRating: PropTypes.number,
  parentComponentRefetch: PropTypes.func,
}
