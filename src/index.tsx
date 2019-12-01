import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Normalize } from 'react-atomicus'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import 'easymde/dist/easymde.min.css'
import {
  IntrospectionFragmentMatcher,
  InMemoryCache,
} from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

const cache = new InMemoryCache({ fragmentMatcher })

const client = new ApolloClient({
  cache,
  link: new HttpLink({ uri: process.env.REACT_APP_FOXCMS_GRAPHQL }),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Normalize />
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
