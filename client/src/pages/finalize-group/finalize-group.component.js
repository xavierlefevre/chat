// @flow
/* eslint no-bitwise:0 */
import { _ } from 'lodash';
import React, { Component } from 'react';
import { Alert, Image, ListView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import update from 'immutability-helper';

import SelectedUserList from '../../components/selected-user-list.component';

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  input: {
    color: 'black',
    height: 32,
  },
  inputBorder: {
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  inputInstructions: {
    paddingTop: 6,
    color: '#777',
    fontSize: 12,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    color: 'blue',
    fontSize: 18,
    paddingTop: 2,
  },
  participants: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
});

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

  constructor(props: PropsType) {
    super(props);
    this.state = {
      selected: props.selected,
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }).cloneWithRows(props.selected),
      name: '',
    };
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
    Actions.pop({ refresh: { selected: this.state.selected } });
  }

  remove(user: FriendType) {
    const index = this.state.selected.indexOf(user);
    if (~index) {
      const selected = update(this.state.selected, { $splice: [[index, 1]] });
      this.setState({
        selected,
        ds: this.state.ds.cloneWithRows(selected),
      });
    }
  }

  create() {
    const { createGroup } = this.props;

    createGroup({
      name: this.state.name,
      userIds: _.map(this.state.selected, 'id'),
      userId: 1, // fake user for now
    })
      .then(() => {
        // TODO: want to pop back to groups and then jump into messages
        Actions.tabs({ type: 'reset' });
      })
      .catch(error => {
        Alert.alert('Error Creating New Group', error.message, [
          { text: 'OK', onPress: () => console.log('OK pressed') },
        ]);
      });
  }

  refreshNavigation(enabled: boolean) {
    Actions.refresh({
      onBack: () => this.pop(),
      backTitle: 'Back',
      rightTitle: enabled ? 'Create' : undefined,
      onRight: enabled ? () => this.create() : undefined,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.imageContainer}>
            <Image style={styles.groupImage} source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }} />
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
            ? <SelectedUserList dataSource={this.state.ds} remove={user => this.remove(user)} />
            : undefined}
        </View>
      </View>
    );
  }
}
