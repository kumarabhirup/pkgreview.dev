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
      const reviews = reviewModel.find({
        package: npmContext?.context?.packageVersion?.name,
      })

      return {
        name: npmContext?.context?.packageVersion?.name,
        type: 'npm',
        version: npmContext?.context?.packageVersion?.version,
        maintainers: npmContext?.context?.packageVersion?.maintainers,
        githubRepoUrl: npmContext?.context?.packageVersion?.repository,
        description: npmContext?.context?.packageVersion?.description,
        reviews,
      }
    }

    throw new Error('The provided package does not exist')
  }

  return {}
}

export default getPackageQuery
