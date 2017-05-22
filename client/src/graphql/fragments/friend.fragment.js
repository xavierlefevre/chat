// @flow
import gql from 'graphql-tag';

const FRIEND_FRAGMENT = gql`
  fragment FriendFragment on User {
    id
    username
  }
`;

export default FRIEND_FRAGMENT;
