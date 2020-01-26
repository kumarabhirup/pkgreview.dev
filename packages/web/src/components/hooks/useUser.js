import { useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo'
import axios from 'axios'

import { getCurrentUser } from '../ProvideUser'

export default function useUser(githubId = null) {
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState(null)

  const [userId, setUserId] = useState(null)
  const [userGithubId, setUserGithubId] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    // fetch user id
    ;(async () => {
      const user = await getCurrentUser(client)

      if (user?.data?.getCurrentUser?._id) {
        setUserId(user?.data?.getCurrentUser?._id)
        setUserGithubId(user?.data?.getCurrentUser?.githubId)
      }
    })()
  }, [client, githubId, userGithubId])

  useEffect(() => {
    // fetch github user avatar
    ;(async () => {
      if (githubId || userGithubId) {
        const githubIdToBeConsidered = githubId || userGithubId

        const response = await axios
          .get(`https://api.github.com/user/${githubIdToBeConsidered}`)
          .then(({ data }) => data)

        // eslint-disable-next-line camelcase
        setAvatar(response?.avatar_url)
        setUsername(response?.login)
      }
    })()
  })

  return [
    { avatar, username },
    { userId, userGithubId },
  ]
}
