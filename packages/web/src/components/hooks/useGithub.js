/* eslint-disable camelcase */

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useGithub(githubUrl) {
  const gitHubSlug = githubUrl.substr(19) // https://github.com/lodash/lodash -> lodash/lodash

  const [openIssuesNumber, setOpenIssuesNumber] = useState(null)
  const [starGazersNumber, setStarGazersNumber] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [forksNumber, setForksNumber] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // To get Open Issues Number
  useEffect(() => {
    ;(async () => {
      setLoading(true)

      const response = await axios
        .get(`https://api.github.com/repos/${gitHubSlug}`)
        .then(({ data }) => data)
        .catch(error => {
          setError(true)
          setLoading(false)
        })

      setOpenIssuesNumber(response?.open_issues)
      setStarGazersNumber(response?.stargazers_count)
      setForksNumber(response?.forks)

      const latestCommit = await axios
        .get(`https://api.github.com/repos/${gitHubSlug}/commits`)
        .then(({ data }) => data[0])
        .catch(error => {
          setError(true)
          setLoading(false)
        })

      setLastUpdated(latestCommit?.commit?.author?.date)

      setLoading(false)
    })()
  }, [openIssuesNumber, starGazersNumber, lastUpdated, forksNumber, gitHubSlug])

  return [
    { openIssuesNumber, starGazersNumber, lastUpdated, forksNumber },
    { loading, error },
  ]
}
