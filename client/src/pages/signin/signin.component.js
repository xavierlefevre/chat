// @flow
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { setCurrentUserAction } from 'ChatApp/src/redux';

import styles from './signin.style';

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

type PropsType = {
  auth: {
    loading: boolean,
    jwt: string,
  },
  dispatch: () => void,
  login: () => Promise<any>,
  signup: () => Promise<any>,
  navigation: NavigationPropsType,
};

type StateType = {
  view: string,
  loading: boolean,
  email: string,
  password: string,
};

export default class Signin extends Component {
  props: PropsType;
  state: StateType;

  static navigationOptions = {
    title: 'ChatApp',
    headerLeft: null,
  };

  constructor() {
    super();
    this.state = {
      view: 'login',
      loading: false,
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    if (this.props.auth.jwt) {
      this.props.navigation.goBack();
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    if (nextProps.auth.jwt) {
      nextProps.navigation.goBack();
    }
  }

  login() {
    const { email, password } = this.state;
    this.setState({ loading: true });

    this.props
      .login({ email, password })
      .then(({ data: { login: user } }) => {
        this.props.dispatch(setCurrentUserAction(user));
        this.setState({
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.view)} error`,
          error.message,
          [
            { text: 'OK', onPress: () => console.log('OK pressed') }, // eslint-disable-line no-console
            {
              text: 'Forgot password',
              onPress: () => console.log('Forgot Pressed'), // eslint-disable-line no-console
              style: 'cancel',
            },
          ]
        );
      });
  }

  signup() {
    this.setState({ loading: true });
    const { email, password } = this.state;

    this.props
      .signup({ email, password })
      .then(({ data: { signup: user } }) => {
        this.props.dispatch(setCurrentUserAction(user));
        this.setState({
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.view)} error`,
          error.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }] // eslint-disable-line no-console
        );
      });
  }

  switchView() {
    this.setState({
      view: this.state.view === 'signup' ? 'login' : 'signup',
    });
  }

  render() {
    const { view } = this.state;

    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        {this.state.loading
          ? <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View>
          : undefined}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={email => this.setState({ email })}
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <Button
          onPress={view === 'signup' ? () => this.signup() : () => this.login()}
          style={styles.submit}
          title={view === 'signup' ? 'Sign up' : 'Login'}
          disabled={this.state.loading || !!this.props.auth.jwt}
        />
        <View style={styles.switchContainer}>
          <Text>
            {view === 'signup' ? 'Already have an account?' : 'New to ChatApp?'}
          </Text>
          <TouchableOpacity onPress={() => this.switchView()}>
            <Text style={styles.switchAction}>
              {view === 'login' ? 'Sign up' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
