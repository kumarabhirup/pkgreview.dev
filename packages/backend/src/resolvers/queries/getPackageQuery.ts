/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import '../../utils/env'
import * as puppeteer from 'puppeteer'

import reviewModel from '../../models/Review'
import { getWindowHandle } from '../../utils/puppeteerDirect'

type PackageType = 'npm'

const getPackageQuery = async (
  parent,
  { slug, type }: { slug: string; type: PackageType },
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

      return {
        name: npmContext?.context?.packageVersion?.name,
        type: 'npm',
        version: npmContext?.context?.packageVersion?.version,
        maintainers: npmContext?.context?.packageVersion?.maintainers,
        githubRepoUrl: npmContext?.context?.packageVersion?.repository,
        description: npmContext?.context?.packageVersion?.description,
        reviews,
        rating: averageRating,
      }
    }

    throw new Error('The provided package does not exist')
  }

  return {}
}

export default getPackageQuery
