// @flow
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { connect } from 'react-redux';

import { GROUP_QUERY, CREATE_MESSAGE_MUTATION, MESSAGE_ADDED_SUBSCRIPTION } from 'ChatApp/src/graphql';

import Messages from './messages.component';

// helper function checks for duplicate comments
// TODO it's pretty inefficient to scan all the comments every time.
// maybe only scan the first 10, or up to a certain timestamp
function isDuplicateMessage(newMessage, existingMessages) {
  return newMessage.id !== null && existingMessages.some(message => newMessage.id === message.id);
}

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
    subscribeToMessages(groupId) {
      return subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: { groupIds: [groupId] },
        updateQuery: (previousResult, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;

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
      });
    },
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

const createMessage = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    createMessage: ({ text, groupId }) =>
      mutate({
        variables: { text, groupId },
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: null,
            text,
            createdAt: new Date().toISOString(),
            from: {
              __typename: 'User',
              id: ownProps.auth.id,
              username: 'Justyn.Kautzer',
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), groupQuery, createMessage)(Messages);
