/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import '../../utils/env'
import axios from 'axios'

import reviewModel from '../../models/Review'
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
  context,
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
      const reviews = await reviewModel
        .find({
          package: fetchedPackage?.collected?.metadata?.name,
        })
        .sort('-updatedAt')
        .populate('author')
        .exec()

      // Calculate average rating
      let averageRating = null

      if (reviews.length > 0) {
        let totalRating = 0

        for (const review of reviews) {
          const {
            // @ts-ignore
            rating: { score, total },
          } = review

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
          { request: context.request },
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
          await reviewModel
            .findOne()
            .and([{ author: user }, { package: slug }])
            .then(data => {
              if (data.toObject()._id) {
                userReviewId = data.toObject()._id

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
        ? reviews.findIndex(
            review =>
              review.toObject()._id.toString() === userReviewId.toString()
          )
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
