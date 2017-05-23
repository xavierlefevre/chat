// @flow
import gql from 'graphql-tag';

import FRIEND_FRAGMENT from '../fragments/friend.fragment';

const ADD_FRIEND_MUTATION = gql`
  mutation addFriend($username: String!) {
    addFriend(username: $username) {
      ... FriendFragment
    }
  }
  ${FRIEND_FRAGMENT}
`;

export default ADD_FRIEND_MUTATION;
