import React from 'react'
import App from 'next/app'

import Page from '../src/components/Page'

import '../src/lib/styles/blocks.sass'

class Wrapper extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // This exposes query to the user
    pageProps.query = ctx.query
    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Page>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Page>
    )
  }
}

export default Wrapper
