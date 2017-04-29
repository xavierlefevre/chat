// @flow
import gql from 'graphql-tag';

export const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      username
      groups {
        id
        name
      }
    }
  }
`;

export default USER_QUERY;
