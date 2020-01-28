/* eslint-disable react/prop-types */

import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import Head from 'next/head'
import gql from 'graphql-tag'

import RegularPage from '../../src/components/RegularPage'
import PackageInfoBlock from '../../src/components/PackageInfoBlock'
import PackageGitHubBlock from '../../src/components/PackageGitHubBlock'
import PackageReviewsBlock from '../../src/components/PackageReviewsBlock'
import { Spacing } from '../../src/lib/styles/styled'
import cookies from '../../src/lib/cookies'
import useUser from '../../src/components/hooks/useUser'
import { meta } from '../../src/api/meta'
// eslint-disable-next-line import/no-cycle
import ComposeReviewBlock from '../../src/components/ComposeReviewBlock'

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
        updatedAt
      }
      rating
      isUserMaintainer
      hasUserReviewed
    }
  }
`

function Package() {
  const router = useRouter()
  const { pid } = router.query

  const [_notUsedVariable, { userId }] = useUser()

  const { data, loading, error, refetch } = useQuery(
    GET_PACKAGE_AND_REVIEWS_QUERY,
    {
      variables: {
        slug: encodeURIComponent(pid),
        currentUserToken: cookies.get('pkgReviewToken'),
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  const response = data?.getPackageAndReviews

  const metaDescription = `Read reviews and ratings of the NPM Package '${pid}'.`

  return (
    <RegularPage>
      <>
        <Head>
          <title>
            {pid} - NPM Reviews − {meta.name}
          </title>

          <meta
            property="og:title"
            content={`${pid} - NPM Reviews − ${meta.name}`}
          />
          <meta
            name="twitter:title"
            content={`${pid} - NPM Reviews − ${meta.name}`}
          />

          <meta name="description" content={metaDescription} />
          <meta property="og:description" content={metaDescription} />
          <meta name="twitter:description" content={metaDescription} />

          <meta name="url" content={`https://${meta.domain}/npm/${pid}`} />
          <meta
            name="identifier-URL"
            content={`https://${meta.domain}/npm/${pid}`}
          />
        </Head>

        {loading && <p>Loading...</p>}

        {error && <p>{error.message}</p>}

        {data && (
          <>
            <PackageInfoBlock packageInfo={response} />

            {response?.githubRepoUrl && (
              <>
                <Spacing />
                <PackageGitHubBlock githubRepoUrl={response?.githubRepoUrl} />
              </>
            )}

            <PackageReviewsBlock packageReviews={response?.reviews} />
            <Spacing />
            <ComposeReviewBlock
              packageSlug={`npm/${pid}`}
              existingReview={
                response?.reviews?.filter(
                  review => review?.author?._id === userId
                )[0]
              }
              averagePackageRating={response?.rating}
              parentComponentRefetch={refetch}
            />
          </>
        )}
      </>
    </RegularPage>
  )
}

export default Package
