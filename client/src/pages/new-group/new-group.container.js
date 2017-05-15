// @flow
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { USER_QUERY } from '../../graphql';
import NewGroup from './new-group.component';

const userQuery = graphql(USER_QUERY, {
  options: ({ auth }) => ({ variables: { id: auth.id } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(NewGroup);
