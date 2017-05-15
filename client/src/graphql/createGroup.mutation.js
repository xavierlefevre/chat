// @flow
import gql from 'graphql-tag';

const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($name: String!, $userIds: [Int!]) {
    createGroup(name: $name, userIds: $userIds) {
      id
      name
      users {
        id
      }
    }
  }
`;

export default CREATE_GROUP_MUTATION;
