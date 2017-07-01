// @flow
/* eslint no-bitwise:0 */
import { _ } from 'lodash';
import React, { Component } from 'react';
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import update from 'immutability-helper';

import { SelectedUserList } from 'ChatApp/src/components';

import styles from './finalize-group.style';

type PropsType = {
  createGroup: () => Promise<any>,
  friendCount: number,
  selected: Array<FriendType>,
  user: UserType,
};
type StateType = {
  selected: Array<FriendType>,
  ds: any,
  name: string,
};

export default class FinalizeGroup extends Component {
  props: PropsType;
  state: StateType;

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group',
      headerRight: isReady ? <Button title="Create" onPress={state.params.create} /> : undefined,
    };
  };

  constructor(props: PropsType) {
    super(props);

    const { selected } = props.navigation.state.params;
    this.state = { selected };
  }

  componentDidMount() {
    this.refreshNavigation(!!this.state.selected.length && !!this.state.name);
  }

  componentWillUpdate(nextProps: PropsType, nextState: StateType) {
    if ((nextState.selected.length && nextState.name) !== (this.state.selected.length && this.state.name)) {
      this.refreshNavigation(!!nextState.selected.length && !!nextState.name);
    }
  }

  pop() {
    this.props.navigation.goBack();
  }

  remove(user: FriendType) {
    const index = this.state.selected.indexOf(user);
    if (~index) {
      const selected = update(this.state.selected, { $splice: [[index, 1]] });
      this.setState({ selected });
    }
  }

  create() {
    const { createGroup } = this.props;

    createGroup({
      name: this.state.name,
      userIds: _.map(this.state.selected, 'id'),
    })
      .then(res => {
        this.props.navigation.dispatch(this.goToNewGroup(res.data.createGroup));
      })
      .catch(error => {
        Alert.alert('Error Creating New Group', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  }

  refreshNavigation(ready) {
    const { navigation } = this.props;
    navigation.setParams({
      mode: ready ? 'ready' : undefined,
      create: this.create,
    });
  }

  goToNewGroup = group =>
    NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Main' }),
        NavigationActions.navigate({
          routeName: 'Messages',
          params: { groupId: group.id, title: group.name },
        }),
      ],
    });

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.imageContainer}>
            <Image
              style={styles.groupImage}
              source={{
                uri: 'https://facebook.github.io/react/img/logo_og.png',
              }}
            />
            <Text>edit</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <View style={styles.inputBorder}>
              <TextInput
                autoFocus
                onChangeText={name => this.setState({ name })}
                placeholder="Group Subject"
                style={styles.input}
              />
            </View>
            <Text style={styles.inputInstructions}>
              {'Please provide a group subject and optional group icon'}
            </Text>
          </View>
        </View>
        <Text style={styles.participants}>
          {`participants: ${this.state.selected.length} of ${this.props.friendCount}`.toUpperCase()}
        </Text>
        <View style={styles.selected}>
          {this.state.selected.length
            ? <SelectedUserList data={this.state.selected} remove={user => this.remove(user)} />
            : undefined}
        </View>
      </View>
    );
  }
}
