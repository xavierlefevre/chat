// @flow
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import USER_QUERY from '../../queries/user.query';
import CREATE_GROUP_MUTATION from '../../queries/createGroup.mutation';
import FinalizeGroup from './finalize-group.component';

// helper function checks for duplicate groups, which we receive because we
// get subscription updates for our own groups as well.
// TODO it's pretty inefficient to scan all the groups every time.
// maybe only scan the first 10, or up to a certain timestamp
function isDuplicateGroup(newGroup, existingGroups) {
  return newGroup.id !== null && existingGroups.some(group => newGroup.id === group.id);
}

const createGroup = graphql(CREATE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    createGroup: ({ name, userIds, userId }) =>
      mutate({
        variables: { name, userIds, userId },
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            const newGroup = mutationResult.data.createGroup;

            if (!previousResult.user.groups || isDuplicateGroup(newGroup, previousResult.user.groups)) {
              return previousResult;
            }

            return update(previousResult, {
              user: {
                groups: {
                  $push: [newGroup],
                },
              },
            });
          },
        },
      }),
  }),
});

const userQuery = graphql(USER_QUERY, {
  options: ({ userId }) => ({ variables: { id: userId } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default compose(userQuery, createGroup)(FinalizeGroup);
