import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    getCurrentUser {
      _id
      name
      email
      githubUsername
      githubId
      reviews {
        _id
        package
        rating {
          score
          total
        }
        review
      }
      createdAt
      updatedAt
    }
  }
`

export const getMe = async client => {
  const me = await client.query({
    query: CURRENT_USER_QUERY,
  })

  return me
}

const ProvideUser = props => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {payload => props.children(payload)}
  </Query>
)

ProvideUser.propTypes = {
  children: PropTypes.func.isRequired,
}

export default ProvideUser
