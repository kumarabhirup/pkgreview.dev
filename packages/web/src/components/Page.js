import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components'

import Meta from './Meta'

const theme = {
  defaultColor: '#ffffff',
}

class Page extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props
    return (
      <ThemeProvider theme={theme}>
        {/* 
          React.Fragments needed, 
          or see this error 👉 `https://stackoverflow.com/questions/43300897/react-children-only-expected-to-receive-a-single-react-element-child-navigator/43301040` 
        */}
        <>
          <Meta />
          {children}
        </>
      </ThemeProvider>
    )
  }
}

export default Page
