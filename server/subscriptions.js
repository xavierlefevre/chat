import { PubSub, SubscriptionManager } from 'graphql-subscriptions';

import { executableSchema } from './data/schema';

export const pubsub = new PubSub();
export const subscriptionManager = new SubscriptionManager({
  schema: executableSchema,
  pubsub,
  setupFunctions: {
    messageAdded: (options, args) => ({
      messageAdded: {
        filter: message => args.groupIds && ~args.groupIds.indexOf(message.groupId),
      },
    }),
  },
});
