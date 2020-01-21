import React from 'react'
import { useRouter } from 'next/router'

import RegularPage from '../../src/components/RegularPage'
import PackageInfoBlock from '../../src/components/PackageInfoBlock'
import PackageReviewsBlock from '../../src/components/PackageReviewsBlock'
import { Spacing } from '../../src/lib/styles/styled'

export default function Package() {
  const router = useRouter()
  const { pid } = router.query

  return (
    <RegularPage>
      <PackageInfoBlock packageSlug={`npm/${pid}`} />
      <PackageReviewsBlock packageSlug={`npm/${pid}`} />
    </RegularPage>
  )
}
