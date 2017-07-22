// @flow
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { compose } from 'redux';

import { LOGIN_MUTATION, SIGNUP_MUTATION } from 'ChatApp/src/graphql';

import Signin from './signin.component';

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
