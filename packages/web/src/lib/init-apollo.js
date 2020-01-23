import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'

// import { WebSocketLink } from 'apollo-link-ws'
// import { getMainDefinition } from 'apollo-utilities'

const httpLink = new HttpLink({
  uri: process.env.PR_API_ENDPOINT
    ? `${process.env.PR_API_ENDPOINT}/api/graphql`
    : `/api/graphql`,
})
const cache = new InMemoryCache()

let link = null

if (process.browser) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        // tslint:disable-next-line:no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }
    if (networkError) {
      // tslint:disable-next-line:no-console
      console.log(`[Network error]: ${networkError}`)
    }
  })

  link = ApolloLink.from([errorLink, httpLink])
}

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create(initialState, cookie = null) {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Cookie: cookie,
    },
  }))
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: process.browser ? link : authLink.concat(httpLink),
    cache: cache.restore(initialState || {}),
  })
}

export default function initApollo(initialState, cookie) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, cookie)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
