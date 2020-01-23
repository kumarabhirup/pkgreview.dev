import React from 'react'
import App from 'next/app'
import { ApolloProvider } from 'react-apollo'

import withData from '../src/lib/with-apollo-client'
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
    const { Component, apolloClient, pageProps } = this.props

    return (
      <ApolloProvider client={apolloClient}>
        <Page>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    )
  }
}

export default withData(Wrapper)
