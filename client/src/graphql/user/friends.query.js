// @flow
import gql from 'graphql-tag';

const FRIENDS_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      friends {
        id
        username
      }
    }
  }
`;

export default FRIENDS_QUERY;
