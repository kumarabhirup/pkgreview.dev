import React from 'react'

import RegularPage from '../src/components/RegularPage'
import Block from '../src/components/Block'

export default function HomePage() {
  return (
    <RegularPage>
      <Block>
        See{' '}
        <code className="block accent fixed" style={{ display: 'inline' }}>
          pkgreview.dev/npm/package-name
        </code>{' '}
        for reviews. Webpage still under development.
      </Block>
    </RegularPage>
  )
}
