// @flow
import React, { Component } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from './signin.style';

type StateType = {
  view: string,
  loading: boolean,
  email: string,
  password: string,
};

export default class Signin extends Component {
  state: StateType;

  constructor() {
    super();
    this.state = {
      view: 'login',
      loading: false,
      email: '',
      password: '',
    };
  }

  // fake for now
  login() {
    console.log('logging in');
    this.setState({ loading: true });
    setTimeout(() => {
      Actions.pop();
    }, 1000);
  }

  // fake for now
  signup() {
    console.log('signing up');
    this.setState({ loading: true });
    setTimeout(() => {
      Actions.pop();
    }, 1000);
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
          <TextInput onChangeText={email => this.setState({ email })} placeholder={'Email'} style={styles.input} />
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <Button
          onPress={view === 'signup' ? () => this.signup : () => this.login()}
          style={styles.submit}
          title={view === 'signup' ? 'Sign up' : 'Login'}
          disabled={this.state.loading}
        />
        <View style={styles.switchContainer}>
          <Text>
            {view === 'signup' ? 'Already have an account?' : 'New to Chatty?'}
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
