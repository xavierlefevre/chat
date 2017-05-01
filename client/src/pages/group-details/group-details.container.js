// @flow
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import { GROUP_QUERY, DELETE_GROUP_MUTATION, LEAVE_GROUP_MUTATION } from '../../queries';
import GroupDetails from './group-details.component';

const group = graphql(GROUP_QUERY, {
  options: ({ id }) => ({ variables: { groupId: id } }),
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
                  $set: previousResult.user.groups.filter(g => removedGroup.id !== g.id),
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
        variables: { id: ownProps.id, userId: 1 }, // fake user for now
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            console.log(previousResult);
            const removedGroup = mutationResult.data.leaveGroup;

            return update(previousResult, {
              user: {
                groups: {
                  $set: previousResult.user.groups.filter(g => removedGroup.id !== g.id),
                },
              },
            });
          },
        },
      }),
  }),
});

export default compose(group, deleteGroup, leaveGroup)(GroupDetails);
