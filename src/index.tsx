import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Normalize } from 'react-atomicus'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
import 'easymde/dist/easymde.min.css'

const client = new ApolloClient({
  uri: process.env.REACT_APP_FOXCMS_GRAPHQL,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Normalize/>
    <App/>
  </ApolloProvider>,
  document.getElementById('root'),
)
