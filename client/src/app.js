// @flow
/* eslint no-param-reassign: 0 */
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws-authy';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';

import AppWithNavigationState, { navigationReducer } from 'ChatApp/src/navigation';
import { authReducer, peopleReducer, logoutAction } from 'ChatApp/src/redux';
import ENV from 'ChatApp/src/environment';

global.XMLHttpRequest = global.originalXMLHttpRequest ? global.originalXMLHttpRequest : global.XMLHttpRequest;
global.FormData = global.originalFormData ? global.originalFormData : global.FormData;

const networkInterface = createNetworkInterface({
  uri: `http://${ENV.url}:${ENV.port}/graphql`,
});

// Create WebSocket client
const wsClient = new SubscriptionClient(`ws://${ENV.url}:${ENV.port}/subscriptions`, {
  reconnect: true,
  connectionParams: {
    // Pass any arguments you want for initialization
  },
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);
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
  composeWithDevTools(applyMiddleware(client.middleware(), thunk), autoRehydrate())
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
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      // get the authentication token from local storage if it exists
      const jwt = store.getState().auth.jwt;
      if (jwt) {
        req.options.headers.authorization = `Bearer ${jwt}`;
      }
      next();
    },
  },
]);

// middleware for responses
networkInterface.useAfter([
  {
    applyAfterware({ response }, next) {
      if (!response.ok) {
        response.clone().text().then(bodyText => {
          console.log(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
          next();
        });
      } else {
        response.clone().json().then(({ errors }) => {
          if (errors) {
            errors.map(e => {
              if (e.message === 'Unauthorized') {
                return store.dispatch(logoutAction());
              }
              return console.log('GraphQL Error:', e.message);
            });
          }
          next();
        });
      }
    },
  },
]);
