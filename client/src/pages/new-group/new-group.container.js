// @flow
import { graphql, compose } from 'react-apollo';

import USER_QUERY from '../../queries/user.query';
import NewGroup from './new-group.component';

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }),
});

export default compose(userQuery)(NewGroup);
