import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import cookies from '../lib/cookies'

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY($token: String) {
    getCurrentUser(token: $token) {
      _id
      name
      email
      githubUsername
      githubId
      createdAt
      updatedAt
    }
  }
`

export const getCurrentUser = async (
  client,
  token = cookies.get('pkgReviewToken')
) => {
  const currentUser = await client.query({
    query: CURRENT_USER_QUERY,
    variables: {
      token,
    },
  })

  return currentUser
}

const ProvideUser = props => {
  const { token, children } = props
  return (
    <Query {...props} query={CURRENT_USER_QUERY} variables={{ token }}>
      {payload => children(payload)}
    </Query>
  )
}

ProvideUser.propTypes = {
  children: PropTypes.func.isRequired,
  token: PropTypes.string,
}

ProvideUser.defaultProps = {
  token: cookies.get('pkgReviewToken'),
}

export default ProvideUser
