// @flow
import gql from 'graphql-tag';

const ADD_FRIEND_MUTATION = gql`
  mutation addFriend($username: String!) {
    addFriend(username: $username) {
      id
      username
    }
  }
`;

export default ADD_FRIEND_MUTATION;
