// @flow
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import { USER_QUERY } from 'ChatApp/src/graphql';

import Settings from './settings.component';

// here is where the magic happens
const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ({ auth }) => ({ variables: { id: auth.id } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(Settings);
