// @flow
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import { USER_QUERY, ADD_FRIEND_MUTATION } from 'ChatApp/src/graphql';
import { togglePrompt } from 'ChatApp/src/redux';

import People from './people.component';

const addFriend = graphql(ADD_FRIEND_MUTATION, {
  props: ({ mutate }) => ({
    addFriend: username =>
      mutate({
        variables: { username },
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.addFriend;
            return update(previousResult, {
              user: {
                friends: {
                  $push: [newFriend],
                },
              },
            });
          },
        },
      }),
  }),
});

const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ({ auth }) => ({ variables: { id: auth.id } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    friends: (user && user.friends) || [],
  }),
});

const mapStateToProps = ({ auth, people: { promptShown } }) => ({
  auth,
  promptShown,
});
const mapDispatchToProps = dispatch => ({
  togglePrompt: () => dispatch(togglePrompt()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  userQuery,
  addFriend
)(People);
