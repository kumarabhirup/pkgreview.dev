/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { Prisma } from 'prisma-binding'

import getCurrentUserQuery from '../queries/getCurrentUserQuery'
import { generateString } from '../../utils/functions'

type Request = ContextParameters['request']

const flagReviewMutation = async (
  parent,
  {
    reviewId,
    currentUserToken,
  }: {
    reviewId: string
    currentUserToken: string
  },
  { db, request }: { db: Prisma; request: Request },
  info
): Promise<object> => {
  // TODO: Check if user exists, if not, error.
  const user = await getCurrentUserQuery(
    null,
    { token: currentUserToken },
    { request, db },
    null
  )

  if (!user) {
    throw new Error("The user isn't logged in")
  }

  // TODO: If user exists, flag the review
  const time = new Date().toISOString()

  const review = await db.query.review({ where: { id: reviewId } }, info)

  // Check if the user has already flagged the review...
  // const existingReview = await flagModel
  //   .findOne({ by: user, review })
  //   .then(data => data?.toObject())

  const existingReview = await db.query
    .flags({ where: { by: user, review } }, info)
    .then(data => data[0])

  if (existingReview) {
    // throw new Error("This review has already been flagged")

    // return dummy data
    return {
      by: user,
      review,
      createdAt: existingReview?.createdAt,
      updatedAt: existingReview?.updatedAt,
      id: existingReview?.id?.toString(),
    }
  }

  // const createFlag = await flagModel
  //   .insertMany([
  //     {
  //       by: user,
  //       review,
  //       createdAt: time,
  //       updatedAt: time,
  //     },
  //   ])
  //   .then(data => data[0])
  //   .then(data => data?.populate('by review')?.toObject())

  const createFlag = await db.mutation.createFlag(
    {
      data: {
        by: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            id: user?.id,
          },
        },
        review: {
          connect: {
            id: review.id,
          },
        },
      },
    },
    info
  )

  return { ...createFlag, id: createFlag?.id?.toString() }
}

export default flagReviewMutation
