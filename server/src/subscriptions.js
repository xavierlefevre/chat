import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import { map } from 'lodash';
import { parse } from 'graphql';
import { getArgumentValues } from 'graphql/execution/values';

import { executableSchema } from './data/schema';

export function getSubscriptionDetails({ baseParams, schema }) {
  const parsedQuery = parse(baseParams.query);
  let args = {};
  // operationName is the name of the only root field in the
  // subscription document
  let subscriptionName = '';
  parsedQuery.definitions.forEach(definition => {
    if (definition.kind === 'OperationDefinition') {
      // only one root field is allowed on subscription.
      // No fragments for now.
      const rootField = definition.selectionSet.selections[0];
      subscriptionName = rootField.name.value;
      const fields = schema.getSubscriptionType().getFields();
      args = getArgumentValues(fields[subscriptionName], rootField, baseParams.variables);
    }
  });

  return { args, subscriptionName };
}

export const pubsub = new PubSub();
export const subscriptionManager = new SubscriptionManager({
  schema: executableSchema,
  pubsub,
  setupFunctions: {
    groupAdded: (options, args) => ({
      groupAdded: {
        // if the user is in the new group
        filter: group => args.userId && ~map(group.users, 'id').indexOf(args.userId),
      },
    }),
    messageAdded: (options, args) => ({
      messageAdded: {
        filter: message => args.groupIds && ~args.groupIds.indexOf(message.groupId),
      },
    }),
  },
});
