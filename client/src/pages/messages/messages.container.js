// @flow
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import Messages from './messages.component';
import { GROUP_QUERY, CREATE_MESSAGE_MUTATION } from '../../queries';

const ITEMS_PER_PAGE = 10;
const groupQuery = graphql(GROUP_QUERY, {
  options: ({ groupId }) => ({
    variables: {
      groupId,
      offset: 0,
      limit: ITEMS_PER_PAGE,
    },
  }),
  props: ({ data: { fetchMore, loading, group, subscribeToMore } }) => ({
    loading,
    group,
    subscribeToMore,
    loadMoreEntries() {
      return fetchMore({
        variables: {
          offset: group.messages.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return update(previousResult, {
            group: {
              messages: { $push: fetchMoreResult.group.messages },
            },
          });
        },
      });
    },
  }),
});

function isDuplicateMessage(newMessage, existingMessages) {
  return newMessage.id !== null && existingMessages.some(message => newMessage.id === message.id);
}

const createMessage = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: ({ text, userId, groupId }) =>
      mutate({
        variables: { text, userId, groupId },
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: null, // don't know id yet, but it doesn't matter
            text, // we know what the text will be
            createdAt: new Date().toISOString(), // the time is now!
            from: {
              __typename: 'User',
              id: 1, // still faking the user
              username: 'Justyn.Kautzer', // still faking the user
              // maybe we should stop faking the user soon!
            },
          },
        },
        updateQueries: {
          group: (previousResult, { mutationResult }) => {
            const newMessage = mutationResult.data.createMessage;
            if (isDuplicateMessage(newMessage, previousResult.group.messages)) {
              return previousResult;
            }
            return update(previousResult, {
              group: {
                messages: {
                  $unshift: [newMessage],
                },
              },
            });
          },
        },
      }),
  }),
});

export default compose(groupQuery, createMessage)(Messages);
