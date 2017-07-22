// @flow
/* eslint no-param-reassign: 0 */
/* eslint no-use-before-define: 0 */
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

import AppWithNavigationState, {
  navigationReducer,
} from 'ChatApp/src/navigation';
import { authReducer, peopleReducer, logoutAction } from 'ChatApp/src/redux';
import ENV from 'ChatApp/src/environment';

global.XMLHttpRequest = global.originalXMLHttpRequest
  ? global.originalXMLHttpRequest
  : global.XMLHttpRequest;
global.FormData = global.originalFormData
  ? global.originalFormData
  : global.FormData;

const networkInterface = createBatchingNetworkInterface({
  uri: `http://${ENV.url}:${ENV.port}/graphql`,
  batchInterval: 10,
  queryDeduplication: true,
});

// Create WebSocket client
const wsClient = new SubscriptionClient(
  `ws://${ENV.url}:${ENV.port}/subscriptions`,
  {
    reconnect: true,
    connectionParams() {
      // get the authentication token from local storage if it exists
      return { jwt: store.getState().auth.jwt };
    },
    lazy: true,
  }
);

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);
export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
    nav: navigationReducer,
    auth: authReducer,
    people: peopleReducer,
  }),
  {}, // initial state
  composeWithDevTools(
    applyMiddleware(client.middleware(), thunk),
    autoRehydrate()
  )
);

persistStore(store, {
  storage: AsyncStorage,
  blacklist: ['apollo', 'people'], // don't persist apollo
});

export default function() {
  return (
    <ApolloProvider store={store} client={client}>
      <AppWithNavigationState />
    </ApolloProvider>
  );
}

wsClient.use([
  {
    applyMiddleware(options, next) {
      // get the authentication token from local storage if it exists
      const jwt = store.getState().auth.jwt;
      if (jwt) {
        options.context = { jwt };
      }
      next();
    },
  },
]);

// middleware for requests
networkInterface.use([
  {
    applyBatchMiddleware(req, next) {
      // get the authentication token from local storage if it exists
      const jwt = store.getState().auth.jwt;
      if (jwt) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        req.options.headers.authorization = `Bearer ${jwt}`;
      }
      next();
    },
  },
]);

// afterware for responses
networkInterface.useAfter([
  {
    applyBatchAfterware({ responses }, next) {
      let isUnauthorized = false;

      responses.forEach(response => {
        if (response.errors) {
          console.log('GraphQL Error:', response.errors);
          if (_.some(response.errors, { message: 'Unauthorized' })) {
            isUnauthorized = true;
          }
        }
      });

      if (isUnauthorized) {
        store.dispatch(logoutAction());
      }

      next();
    },
  },
]);
