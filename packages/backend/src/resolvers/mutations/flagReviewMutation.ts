/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'

import flagModel from '../../models/Flag'
import reviewModel from '../../models/Review'
import getCurrentUserQuery from '../queries/getCurrentUserQuery'
import { generateString } from '../../utils/functions'

const flagReviewMutation = async (
  parent,
  {
    reviewId,
    currentUserToken,
  }: {
    reviewId: string
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

  // TODO: If user exists, flag the review
  const time = new Date().toISOString()

  const review = await reviewModel.findById(reviewId)

  // Check if the user has already flagged the review...
  const existingReview = await flagModel
    .findOne({ by: user, review })
    .then(data => data.toObject())

  if (existingReview) {
    // throw new Error("This review has already been flagged")

    // return dummy data
    return {
      by: user,
      review,
      createdAt: existingReview?.createdAt,
      updatedAt: existingReview?.updatedAt,
      _id: existingReview?._id?.toString(),
    }
  }

  const createFlag = await flagModel
    .insertMany([
      {
        by: user,
        review,
        createdAt: time,
        updatedAt: time,
      },
    ])
    .then(data => data[0])
    .then(data => data.populate('by review').toObject())

  return { ...createFlag, _id: createFlag?._id?.toString() }
}

export default flagReviewMutation
