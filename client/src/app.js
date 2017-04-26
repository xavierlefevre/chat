import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { Routes, Scenes } from './routes';

global.XMLHttpRequest = global.originalXMLHttpRequest
  ? global.originalXMLHttpRequest
  : global.XMLHttpRequest;
global.FormData = global.originalFormData
  ? global.originalFormData
  : global.FormData;

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
});
const client = new ApolloClient({
  networkInterface,
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  {}, // initial state
  composeWithDevTools(applyMiddleware(client.middleware()))
);

export default class App extends Component {
  render() {
    return (
      <ApolloProvider store={store} client={client}>
        <Routes scenes={Scenes} />
      </ApolloProvider>
    );
  }
}
