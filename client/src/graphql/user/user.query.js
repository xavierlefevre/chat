// @flow
import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from '../fragments/message.fragment';
import FRIEND_FRAGMENT from '../fragments/friend.fragment';

const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      username
      friends {
        ... FriendFragment
      }
      groups {
        id
        name
        messages(limit: 1) { # we don't have to use variables
          ... MessageFragment
        }
      }
    }
  }
  ${MESSAGE_FRAGMENT}
  ${FRIEND_FRAGMENT}
`;

export default USER_QUERY;
