// @flow
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import update from 'immutability-helper';

import {
  GROUP_QUERY,
  DELETE_GROUP_MUTATION,
  LEAVE_GROUP_MUTATION,
} from 'ChatApp/src/graphql';

import GroupDetails from './group-details.component';

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({
    variables: { groupId: ownProps.navigation.state.params.id },
  }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

const deleteGroup = graphql(DELETE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    deleteGroup: () =>
      mutate({
        variables: { id: ownProps.id },
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            const removedGroup = mutationResult.data.deleteGroup;

            return update(previousResult, {
              user: {
                groups: {
                  $set: previousResult.user.groups.filter(
                    g => removedGroup.id !== g.id
                  ),
                },
              },
            });
          },
        },
      }),
  }),
});

const leaveGroup = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    leaveGroup: () =>
      mutate({
        variables: { id: ownProps.id },
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            const removedGroup = mutationResult.data.leaveGroup;

            return update(previousResult, {
              user: {
                groups: {
                  $set: previousResult.user.groups.filter(
                    g => removedGroup.id !== g.id
                  ),
                },
              },
            });
          },
        },
      }),
  }),
});

export default compose(groupQuery, deleteGroup, leaveGroup)(GroupDetails);
