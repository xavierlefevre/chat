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
  options: ({ navigation }) => ({
    variables: {
      groupId: navigation.state.params.groupId,
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

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    createMessage: message =>
      mutate({
        variables: { text: message.text, groupId: message.groupId },
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: -1, // don't know id yet, but it doesn't matter
            text: message.text, // we know what the text will be
            createdAt: new Date().toISOString(), // the time is now!
            from: {
              __typename: 'User',
              id: ownProps.auth.id,
              username: ownProps.auth.username,
            },
            to: {
              __typename: 'Group',
              id: message.groupId,
            },
          },
        },
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GROUP_QUERY,
            variables: {
              groupId: message.groupId,
              offset: 0,
              limit: ITEMS_PER_PAGE,
            },
          });

          if (isDuplicateMessage(createMessage, data.group.messages)) {
            return data;
          }

          // Add our message from the mutation to the end.
          data.group.messages.unshift(createMessage);

          // Write our data back to the cache.
          store.writeQuery({
            query: GROUP_QUERY,
            variables: {
              groupId: message.groupId,
              offset: 0,
              limit: ITEMS_PER_PAGE,
            },
            data,
          });
        },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), groupQuery, createMessageMutation)(Messages);
