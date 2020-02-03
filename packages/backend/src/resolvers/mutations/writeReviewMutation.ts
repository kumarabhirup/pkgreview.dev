/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/camelcase */

import '../../utils/env'
import { Prisma } from 'prisma-binding'
import { ContextParameters } from 'graphql-yoga/dist/types'

import getCurrentUserQuery from '../queries/getCurrentUserQuery'

type Request = ContextParameters['request']

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

  // Check Rating (For now, let people only rate out of 5)
  if (rating.score > rating.total || rating.score <= 0 || rating.total !== 5) {
    throw new Error('Invalid rating')
  }

  // Find for the existing review...
  // const existingReview = await reviewModel
  //   .findOne()
  //   .and([{ author: user }, { package: packageName }])
  //   .then(data => data?.toObject())

  const existingReview = await db.query
    .reviews(
      {
        where: { AND: [{ author: user }, { package: packageName }] },
      },
      info
    )
    .then(data => (data.length > 0 ? data[0] : null))

  // TODO: If user exists, write the review
  const time = new Date().toISOString()

  let mutateReview

  if (existingReview) {
    // mutateReview = await reviewModel
    //   .findOneAndUpdate(
    //     {
    //       author: user,
    //       package: packageName,
    //     },
    //     {
    //       author: user,
    //       rating,
    //       package: packageName,
    //       review,
    //       updatedAt: time,
    //     }
    //   )
    //   // eslint-disable-next-line no-return-await
    //   .then(async data => await data?.populate('author')?.execPopulate())
    //   .then(data => data?.toObject())

    mutateReview = await db.mutation.updateReview(
      {
        where: { id: existingReview?.id },
        data: {
          author: {
            // @ts-ignore
            connect: { id: user?.id },
          },
          rating,
          package: packageName,
          review,
        },
      },
      info
    )
  } else {
    // mutateReview = await reviewModel
    //   .insertMany([
    //     {
    //       author: user,
    //       rating,
    //       package: packageName,
    //       review,
    //       createdAt: time,
    //       updatedAt: time,
    //     },
    //   ])
    //   .then(data => data[0])
    //   // eslint-disable-next-line no-return-await
    //   .then(async data => await data?.populate('author')?.execPopulate())
    //   .then(data => data?.toObject())

    mutateReview = await db.mutation.createReview(
      {
        author: {
          connect: {
            // @ts-ignore
            id: user?.id,
          },
        },
        rating,
        package: packageName,
        review,
      },
      info
    )
  }

  return { ...mutateReview, id: mutateReview?.id }
}

export default writeReviewMutation
