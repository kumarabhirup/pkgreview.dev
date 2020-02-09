/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import '../../utils/env'
import axios from 'axios'
import { Prisma } from 'prisma-binding'
import { Context } from 'graphql-yoga/dist/types'

import getCurrentUserQuery from './getCurrentUserQuery'
import { arrayElementMove } from '../../utils/functions'

type PackageType = 'npm'

const getPackageQuery = async (
  parent,
  {
    slug,
    type,
    currentUserToken,
  }: { slug: string; type: PackageType; currentUserToken: string },
  { db, context }: { db: Prisma; context: Context },
  info
): Promise<object> => {
  if (type === 'npm') {
    let fetchedPackage

    try {
      fetchedPackage = await axios
        .get(`https://api.npms.io/v2/package/${slug}`)
        .then(({ data }) => data)
    } catch (error) {
      throw new Error('The provided package does not exist')
    }

    if (fetchedPackage?.collected?.metadata?.name) {
      // const reviews = await reviewModel
      //   .find({
      //     package: fetchedPackage?.collected?.metadata?.name,
      //   })
      //   .sort('-updatedAt')
      //   .populate('author')
      //   .exec()

      const reviews = await db.query.reviews(
        {
          where: { package: fetchedPackage?.collected?.metadata?.name },
          orderBy: 'updatedAt_DESC',
        },
        /* GraphQL */ `
          {
            id
            author {
              id
              name
              githubUsername
              githubId
            }
            rating
            review
            package
            updatedAt
            createdAt
          }
        `
      )

      // Calculate average rating
      let averageRating = null

      if (reviews.length > 0) {
        let totalRating = 0

        for (const review of reviews) {
          const { rating } = review

          const { score, total } = JSON.parse(rating)

          const rate = score / total

          totalRating += rate
        }

        averageRating = totalRating / reviews.length
      }

      // User
      let user

      if (currentUserToken) {
        user = await getCurrentUserQuery(
          null,
          { token: currentUserToken },
          { request: context?.request, db },
          null
        )
      }

      // Is logged in user a maintainer?
      let isUserMaintainer = null

      if (user) {
        if (
          fetchedPackage?.collected?.metadata?.maintainers
            .map(maintainer => maintainer.email)
            // @ts-ignore
            .includes(user.email)
        ) {
          isUserMaintainer = true
        } else {
          isUserMaintainer = false
        }
      }

      // Has the logged in user reviewed this package?
      let hasUserReviewed = null

      let userReviewId = null

      if (user) {
        try {
          await db.query
            .reviews(
              {
                where: {
                  AND: [{ author: { id: user?.id } }, { package: slug }],
                },
              },
              /* GraphQL */ `
                {
                  id
                }
              `
            )
            .then(data => {
              const review = data[0]

              if (review.id) {
                userReviewId = review?.id
                hasUserReviewed = true
              } else {
                hasUserReviewed = false
              }
            })
        } catch (error) {
          hasUserReviewed = false
        }
      }

      // Find Index of the review in the `reviews` array that is authored by the currentUser
      const userReviewIndex = userReviewId
        ? reviews.findIndex(review => review.id === userReviewId)
        : null

      return {
        name: fetchedPackage?.collected?.metadata?.name,
        type: 'npm',
        version: fetchedPackage?.collected?.metadata?.version,
        maintainers: fetchedPackage?.collected?.metadata?.maintainers,
        githubRepoUrl: fetchedPackage?.collected?.metadata?.links?.repository,
        description: fetchedPackage?.collected?.metadata?.description,

        // The following arranges `reviews` in such a way that the `userReview` appears first!
        /* eslint-disable prettier/prettier */
        reviews: userReviewIndex ?
          // @ts-ignore
          arrayElementMove(reviews, userReviewIndex, 0)
          : reviews,
        /* eslint-enable prettier/prettier */

        rating: averageRating,
        isUserMaintainer,
        hasUserReviewed,
      }
    }

    throw new Error('The provided package does not exist')
  }

  return {}
}

export default getPackageQuery
