// @flow
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { map } from 'lodash';
import update from 'immutability-helper';

import Groups from './groups.component';
import { USER_QUERY, MESSAGE_ADDED_SUBSCRIPTION, GROUP_ADDED_SUBSCRIPTION } from '../../graphql';

function isDuplicateDocument(newDocument, existingDocuments) {
  return newDocument.id !== null && existingDocuments.some(doc => newDocument.id === doc.id);
}

const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ownProps => ({ variables: { id: ownProps.auth.id } }),
  props: ({ data: { loading, refetch, user, subscribeToMore } }) => ({
    loading,
    refetch,
    user,
    subscribeToMessages() {
      return subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: { groupIds: map(user.groups, 'id') },
        updateQuery: (previousResult, { subscriptionData }) => {
          const previousGroups = previousResult.user.groups;
          const newMessage = subscriptionData.data.messageAdded;

          const groupIndex = map(previousGroups, 'id').indexOf(newMessage.to.id);

          // if it's our own mutation, we might get the subscription result
          // after the mutation result.
          if (isDuplicateDocument(newMessage, previousGroups[groupIndex].messages)) {
            return previousResult;
          }

          return update(previousResult, {
            user: {
              groups: {
                [groupIndex]: {
                  messages: { $set: [newMessage] },
                },
              },
            },
          });
        },
      });
    },
    subscribeToGroups() {
      return subscribeToMore({
        document: GROUP_ADDED_SUBSCRIPTION,
        variables: { userId: user.id },
        updateQuery: (previousResult, { subscriptionData }) => {
          const previousGroups = previousResult.user.groups;
          const newGroup = subscriptionData.data.groupAdded;

          // if it's our own mutation, we might get the subscription result
          // after the mutation result.
          if (isDuplicateDocument(newGroup, previousGroups)) {
            return previousResult;
          }

          return update(previousResult, {
            user: {
              groups: { $push: [newGroup] },
            },
          });
        },
      });
    },
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(Groups);
