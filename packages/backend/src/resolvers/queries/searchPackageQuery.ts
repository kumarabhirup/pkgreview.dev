/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import '../../utils/env'
import axios from 'axios'

const searchPackageQuery = async (
  parent,
  {
    searchString,
    skip,
    limit,
  }: { searchString: string; skip: number; limit: number },
  context,
  info
): Promise<object> => {
  const search = await axios
    .get(
      `https://api.npms.io/v2/search?q=${searchString}&from=${skip}&size=${limit}`
    )
    .then(({ data }) => data)

  const results = search.results.map(result => ({
    name: result?.package?.name,
    type: 'npm',
    version: result?.package?.version,
    maintainers: result?.package?.maintainers,
    githubRepoUrl: result?.package?.links?.repository,
    description: result?.package?.description,
  }))

  return results
}

export default searchPackageQuery
