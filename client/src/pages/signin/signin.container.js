// @flow
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import Signin from './signin.component';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../../graphql';

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ email, password }) =>
      mutate({
        variables: { email, password },
      }),
  }),
});
const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: ({ email, password }) =>
      mutate({
        variables: { email, password },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(login, signup, connect(mapStateToProps))(Signin);
