import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import RegularPage from '../../src/components/RegularPage'
import PackageInfoBlock from '../../src/components/PackageInfoBlock'
import PackageReviewsBlock from '../../src/components/PackageReviewsBlock'
import { Spacing } from '../../src/lib/styles/styled'
import cookies from '../../src/lib/cookies'
// eslint-disable-next-line import/no-cycle
import ComposeReviewBlock from '../../src/components/ComposeReviewBlock'
import useUser from '../../src/components/hooks/useUser'

export const GET_PACKAGE_AND_REVIEWS_QUERY = gql`
  query GET_PACKAGE_AND_REVIEWS_QUERY(
    $slug: String!
    $currentUserToken: String
  ) {
    getPackageAndReviews(
      slug: $slug
      type: "npm"
      currentUserToken: $currentUserToken
    ) {
      name
      type
      version
      maintainers {
        username
      }
      githubRepoUrl
      description
      reviews {
        _id
        review
        author {
          _id
          name
          githubUsername
          githubId
        }
        rating {
          score
          total
        }
        # isFlaggedByUser
      }
      rating
      isUserMaintainer
      hasUserReviewed
    }
  }
`

export default function Package() {
  const router = useRouter()
  const { pid } = router.query

  const [_notUsedVariable, { userId }] = useUser()

  const { data, loading, error } = useQuery(GET_PACKAGE_AND_REVIEWS_QUERY, {
    variables: {
      slug: encodeURIComponent(pid),
      currentUserToken: cookies.get('pkgReviewToken'),
    },
  })

  const response = data?.getPackageAndReviews

  return (
    <RegularPage>
      {loading && <p>Loading...</p>}

      {error && <p>{error.message}</p>}

      {data && (
        <>
          <PackageInfoBlock packageInfo={response} />
          <PackageReviewsBlock packageReviews={response?.reviews} />

          <Spacing />

          <ComposeReviewBlock
            packageSlug={`npm/${pid}`}
            existingReview={
              response?.reviews?.filter(
                review => review?.author?._id === userId
              )[0]
            }
          />
        </>
      )}
    </RegularPage>
  )
}
