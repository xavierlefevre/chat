// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import { Routes, Scenes } from './routes';

global.XMLHttpRequest = global.originalXMLHttpRequest ? global.originalXMLHttpRequest : global.XMLHttpRequest;
global.FormData = global.originalFormData ? global.originalFormData : global.FormData;

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
});
// Create WebSocket client
const wsClient = new SubscriptionClient('ws://localhost:8080/subscriptions', {
  reconnect: true,
  connectionParams: {
    // Pass any arguments you want for initialization
  },
});
// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);
const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  {}, // initial state
  composeWithDevTools(applyMiddleware(client.middleware()))
);

export default function() {
  return (
    <ApolloProvider store={store} client={client}>
      <Routes scenes={Scenes} />
    </ApolloProvider>
  );
}
