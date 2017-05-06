// @flow
import { graphql } from 'react-apollo';

import { USER_QUERY } from '../../graphql';
import Groups from './groups.component';

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }),
  props: ({ data: { loading, refetch, user, subscribeToMore } }) => ({
    loading,
    refetch,
    user,
    subscribeToMore,
  }),
});

export default userQuery(Groups);
