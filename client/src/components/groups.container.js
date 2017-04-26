import { graphql } from 'react-apollo';
import { USER_QUERY } from '../queries/user.query';

import Groups from './groups.component';

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default userQuery(Groups);
