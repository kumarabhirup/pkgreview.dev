import React from 'react'
import PropTypes from 'prop-types'

import Block from './Block'
import StarRating from './StarRating'
import { FlexContainer } from '../lib/styles/styled'

export const getRatingScore = averageRating => {
  const ratingTotal = 5

  const ratingScore = +parseFloat(ratingTotal * averageRating).toFixed(2)

  return [ratingScore, ratingTotal]
}

export default function PackageInfoBlock({ packageInfo }) {
  const [ratingScore, ratingTotal] = getRatingScore(packageInfo?.rating)

  const reviewsText = packageInfo.reviews.length === 1 ? 'review' : 'reviews'

  const maintainersText =
    packageInfo.maintainers.length === 1 ? 'Maintainer' : 'Maintainers'

  const maximumMaintainersToDisplay = 5

  return (
    <Block>
      <FlexContainer lastTextAlign>
        <div>
          <h1 style={{ textAlign: 'start' }}>
            {packageInfo.name}{' '}
            {packageInfo.type === 'npm' && (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg"
                width="50"
                alt="Npm Package Review"
              />
            )}
          </h1>

          <p>{packageInfo.description}</p>

          <p>
            <h3>Version</h3> v{packageInfo.version}
          </p>

          <p>
            <h3>{maintainersText}</h3>{' '}
            {packageInfo.maintainers.map(
              (maintainer, index) =>
                index < maximumMaintainersToDisplay &&
                `${maintainer.username}${
                  index !==
                  packageInfo.maintainers.slice(0, maximumMaintainersToDisplay)
                    .length -
                    1
                    ? `, `
                    : ''
                }`
            )}
            {maximumMaintainersToDisplay < packageInfo.maintainers.length &&
              `, etc.`}
          </p>

          <p>
            <h3>Rating</h3>{' '}
            {packageInfo.reviews.length > 0 ? (
              <>
                {ratingScore}/{ratingTotal} ({packageInfo.reviews.length}{' '}
                {reviewsText})
              </>
            ) : (
              <>
                − / 5 ({packageInfo.reviews.length} {reviewsText})
              </>
            )}
          </p>
        </div>

        <h1>
          <StarRating rating={ratingScore} />
        </h1>
      </FlexContainer>
    </Block>
  )
}

PackageInfoBlock.propTypes = {
  packageInfo: PropTypes.object.isRequired,
}
