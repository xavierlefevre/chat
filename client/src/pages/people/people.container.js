// @flow
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { FRIENDS_QUERY } from 'ChatApp/src/graphql';

import People from './people.component';

const userQuery = graphql(FRIENDS_QUERY, {
  options: ({ auth }) => ({ variables: { id: auth.id } }),
  props: ({ data: { loading, user } }) => ({
    loading,
    friends: user.friends,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(People);
