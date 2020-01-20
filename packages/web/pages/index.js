import React from 'react'

import RegularPage from '../src/components/RegularPage'

export default function HomePage() {
  return (
    <RegularPage>
      See{' '}
      <code className="block accent fixed" style={{ display: 'inline' }}>
        pkgreview.dev/npm/package-name
      </code>{' '}
      for reviews. Webpage still under development.
    </RegularPage>
  )
}
