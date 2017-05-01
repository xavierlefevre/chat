// @flow
import { graphql } from 'react-apollo';

import { USER_QUERY } from '../../queries';
import Groups from './groups.component';

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default userQuery(Groups);
