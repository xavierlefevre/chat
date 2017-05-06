// @flow
import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';

const GROUP_ADDED_SUBSCRIPTION = gql`
  subscription onGroupAdded($userId: Int){
    groupAdded(userId: $userId){
      id
      name
      messages(limit: 1) {
        ... MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export default GROUP_ADDED_SUBSCRIPTION;
