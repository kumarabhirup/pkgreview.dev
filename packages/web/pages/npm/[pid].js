import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StarRating from 'react-star-rating-component'
import axios from 'axios'

import RegularPage from '../../src/components/RegularPage'
import Block from '../../src/components/Block'
import { FlexContainer } from '../../src/lib/styles/styled'

export default function Package() {
  const [pkgInfo, setPkgInfo] = useState(null)

  const router = useRouter()
  const { pid } = router.query

  // useEffect(() => {
  //   // http://registry.npmjs.com/-/v1/search?text=bulk-mail-cli&size=20
  //   // http://registry.npmjs.com/bulk-mail-cli
  //   ;(async () => {
  //     const response = await axios.get(
  //       'http://registry.npmjs.com/bulk-mail-cli'
  //     )

  //     setPkgInfo(response.versions[response.versions.length - 1])
  //   })()
  // })

  // console.log(pkgInfo)

  return (
    <RegularPage>
      <Block>
        <FlexContainer>
          <h1 style={{ textAlign: 'start' }}>
            {pid}{' '}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg"
              width="50"
              alt="Npm Package Review"
            />
          </h1>
          <h1>
            <StarRating
              name="star" /* name of the radio input, it is required */
              value={4} /* number of selected icon (`0` - none, `1` - first) */
              starCount={5} /* number of icons in rating, default `5` */
              renderStarIcon={() => `⭑`}
              starColor="#4f78ff"
              emptyStarColor="#eaeaea"
            />
          </h1>
        </FlexContainer>
      </Block>
    </RegularPage>
  )
}
