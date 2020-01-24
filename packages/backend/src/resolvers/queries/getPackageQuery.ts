/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import '../../utils/env'
import * as puppeteer from 'puppeteer'

import reviewModel from '../../models/Review'
import { getWindowHandle } from '../../utils/puppeteerDirect'
import getCurrentUserQuery from './getCurrentUserQuery'

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
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  if (type === 'npm') {
    await page.goto(`https://www.npmjs.com/package/${slug}`)

    const npmContext = await getWindowHandle(page).__context__

    if (npmContext?.context?.packageVersion?.name) {
      const reviews = await reviewModel
        .find({
          package: npmContext?.context?.packageVersion?.name,
        })
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

      // Is logged in user a maintainer?
      let isUserMaintainer = null

      if (currentUserToken) {
        isUserMaintainer = null

        const user = await getCurrentUserQuery(
          null,
          { token: currentUserToken },
          { request: context.request },
          null
        )

        if (
          npmContext?.context?.packageVersion?.maintainers
            .map(maintainer => maintainer.email)
            // @ts-ignore
            .includes(user.email)
        ) {
          isUserMaintainer = true
        } else {
          isUserMaintainer = false
        }
      }

      return {
        name: npmContext?.context?.packageVersion?.name,
        type: 'npm',
        version: npmContext?.context?.packageVersion?.version,
        maintainers: npmContext?.context?.packageVersion?.maintainers,
        githubRepoUrl: npmContext?.context?.packageVersion?.repository,
        description: npmContext?.context?.packageVersion?.description,
        reviews,
        rating: averageRating,
        isUserMaintainer,
      }
    }

    throw new Error('The provided package does not exist')
  }

  return {}
}

export default getPackageQuery
