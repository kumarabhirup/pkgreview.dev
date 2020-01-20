import React from 'react'
import { useRouter } from 'next/router'

import RegularPage from '../../src/components/RegularPage'

export default function Package() {
  const router = useRouter()

  const { pid } = router.query

  return <RegularPage>{pid}</RegularPage>
}
