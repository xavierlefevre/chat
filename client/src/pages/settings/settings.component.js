// @flow
import React, { Component } from 'react';
import { ActivityIndicator, Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { logoutAction } from 'ChatApp/src/redux';

import styles from './settings.style';

type PropsType = {
  auth: {
    loading: boolean,
    jwt: string,
  },
  dispatch: () => void,
  loading: boolean,
  user: UserType,
};
type StateType = {
  username: string,
};

export default class Settings extends Component {
  props: PropsType;
  state: StateType;

  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    // logout successful, go back to groups/login
    if (!nextProps.auth.jwt) {
      // Actions.groups();
    }
  }

  logout() {
    this.props.dispatch(logoutAction());
  }

  // updateUsername(username) {
  //   console.log('TODO: update username');
  // }

  render() {
    const { user } = this.props;
    // render loading placeholder while we fetch data
    if (!user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.userInner}>
            <TouchableOpacity style={styles.imageContainer}>
              <Image
                style={styles.userImage}
                source={{
                  uri: 'https://facebook.github.io/react/img/logo_og.png',
                }}
              />
              <Text>edit</Text>
            </TouchableOpacity>
            <Text style={styles.inputInstructions}>Enter your name and add an optional profile picture</Text>
          </View>
          <View style={styles.inputBorder}>
            <TextInput
              onChangeText={username => this.setState({ username })}
              placeholder={user.username}
              style={styles.input}
              defaultValue={user.username}
            />
          </View>
        </View>
        <Text style={styles.emailHeader}>
          {'EMAIL'}
        </Text>
        <Text style={styles.email}>
          {user.email}
        </Text>
        <Button title={'Logout'} onPress={() => this.logout()} />
      </View>
    );
  }
}
