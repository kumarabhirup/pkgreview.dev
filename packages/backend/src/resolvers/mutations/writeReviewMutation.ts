/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'

import reviewModel from '../../models/Review'
import getCurrentUserQuery from '../queries/getCurrentUserQuery'

interface Rating {
  score: number

  total: number
}

const writeReviewMutation = async (
  parent,
  {
    review,
    rating,
    packageName,
    currentUserToken,
  }: {
    review: string
    rating: Rating
    packageName: string
    currentUserToken: string
  },
  context,
  info
): Promise<object> => {
  // TODO: Check if user exists, if not, error.
  const user = await getCurrentUserQuery(
    null,
    { token: currentUserToken },
    { request: context.request },
    null
  )

  if (!user) {
    throw new Error("The user isn't logged in")
  }

  // Check Rating
  if (rating.score > rating.total || rating.score <= 0) {
    throw new Error('Invalid rating')
  }

  // Find for the existing review...
  const existingReview = await reviewModel
    .findOne()
    .and([{ author: user }, { package: packageName }])
    .then(data => data?.toObject())

  // TODO: If user exists, write the review
  const time = new Date().toISOString()

  let mutateReview

  if (existingReview) {
    mutateReview = await reviewModel
      .findOneAndUpdate(
        {
          author: user,
          package: packageName,
        },
        {
          author: user,
          rating,
          package: packageName,
          review,
          updatedAt: time,
        }
      )
      // eslint-disable-next-line no-return-await
      .then(async data => await data?.populate('author')?.execPopulate())
      .then(data => data?.toObject())
  } else {
    mutateReview = await reviewModel
      .insertMany([
        {
          author: user,
          rating,
          package: packageName,
          review,
          createdAt: time,
          updatedAt: time,
        },
      ])
      .then(data => data[0])
      // eslint-disable-next-line no-return-await
      .then(async data => await data?.populate('author')?.execPopulate())
      .then(data => data?.toObject())
  }

  return { ...mutateReview, _id: mutateReview?._id }
}

export default writeReviewMutation
