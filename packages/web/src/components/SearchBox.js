import React from 'react'

import { SearchBoxStyledComponent } from '../lib/styles/styled'

export default function SearchBox() {
  return (
    <SearchBoxStyledComponent className="wrapper block">
      <input placeholder="🍹 Search a library/package" type="text" />
    </SearchBoxStyledComponent>
  )
}
