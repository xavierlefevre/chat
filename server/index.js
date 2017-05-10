import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import jwt from 'express-jwt';

import JWT_SECRET from './config';
import { User } from './data/connectors';
import { subscriptionManager } from './subscriptions';
import { executableSchema } from './data/schema';

const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';
const app = express();

app.use(
  '/graphql',
  bodyParser.json(),
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  }),
  graphqlExpress(req => ({
    schema: executableSchema,
    context: {
      user: req.user
        ? User.findOne({
            where: { id: req.user.id },
          })
        : null,
    },
  }))
);
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: GRAPHQL_PATH,
    subscriptionsEndpoint: `ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`,
  })
);

const graphQLServer = createServer(app);
graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}${GRAPHQL_PATH}`);
  console.log(`GraphQL Subscriptions are now running on ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`);
});

// eslint-disable-next-line no-new
new SubscriptionServer(
  {
    subscriptionManager,
  },
  {
    server: graphQLServer,
    path: SUBSCRIPTIONS_PATH,
  }
);
