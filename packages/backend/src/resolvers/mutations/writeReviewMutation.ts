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

  const time = new Date().toISOString()

  // TODO: If user exists, write the review
  const createReview = await reviewModel
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
    .then(data => data.populate('author').toObject())

  return { ...createReview, _id: createReview?._id?.toString() }
}

export default writeReviewMutation
