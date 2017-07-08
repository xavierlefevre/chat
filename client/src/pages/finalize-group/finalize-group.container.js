// @flow
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { USER_QUERY, CREATE_GROUP_MUTATION } from 'ChatApp/src/graphql';

import FinalizeGroup from './finalize-group.component';

// helper function checks for duplicate groups, which we receive because we
// get subscription updates for our own groups as well.
// TODO it's pretty inefficient to scan all the groups every time.
// maybe only scan the first 10, or up to a certain timestamp
function isDuplicateGroup(newGroup, existingGroups) {
  return (
    newGroup.id !== null &&
    existingGroups.some(group => newGroup.id === group.id)
  );
}

const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    createGroup: group =>
      mutate({
        variables: { ...group },
        update: (store, { data: { createGroup } }) => {
          // Read the data from our cache for this query.

          const data = store.readQuery({
            query: USER_QUERY,
            variables: { id: ownProps.auth.id },
          });

          if (isDuplicateGroup(createGroup, data.user.groups)) {
            return;
          }

          // Add our message from the mutation to the end.
          data.user.groups.push(createGroup);

          // Write our data back to the cache.
          store.writeQuery({
            query: USER_QUERY,
            variables: { id: ownProps.auth.id },
            data,
          });
        },
      }),
  }),
});

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.navigation.state.params.userId,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  createGroupMutation
)(FinalizeGroup);
