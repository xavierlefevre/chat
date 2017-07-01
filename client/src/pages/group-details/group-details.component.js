// @flow
import React, { Component } from 'react';
import { ActivityIndicator, Button, Image, ListView, Text, TouchableOpacity, View } from 'react-native';

import styles from './group-details.style';

type PropsType = {
  loading: boolean,
  group: GroupType,
  deleteGroup: () => Promise<any>,
  leaveGroup: () => Promise<any>,
  id: number,
  selected: Array<any>,
};
type StateType = {
  ds: any,
  selected: Array<any>,
};

export default class GroupDetails extends Component {
  props: PropsType;
  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }).cloneWithRows(props.loading ? [] : props.group.users),
      selected: [],
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    if (nextProps.group && nextProps.group.users && nextProps.group !== this.props.group) {
      this.setState({
        selected: nextProps.selected,
        ds: this.state.ds.cloneWithRows(nextProps.group.users),
      });
    }
  }

  deleteGroup() {
    this.props
      .deleteGroup({ id: this.props.id })
      .then(() => {
        // Actions.tabs({ type: 'reset' });
      })
      .catch(e => {
        console.error(e);
      });
  }

  leaveGroup() {
    this.props
      .leaveGroup({ id: this.props.id, userId: 1 }) // fake user for now
      .then(() => {
        // Actions.tabs({ type: 'reset' });
      })
      .catch(e => {
        console.error(e);
      });
  }

  render() {
    const { group, loading } = this.props;

    // render loading placeholder while we fetch messages
    if (!group || loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          renderHeader={() =>
            <View>
              <View style={styles.detailsContainer}>
                <TouchableOpacity style={styles.groupImageContainer} onPress={() => {}}>
                  <Image
                    style={styles.groupImage}
                    source={{
                      uri: 'https://facebook.github.io/react/img/logo_og.png',
                    }}
                  />
                  <Text>edit</Text>
                </TouchableOpacity>
                <View style={styles.groupNameBorder}>
                  <Text style={styles.groupName}>
                    {group.name}
                  </Text>
                </View>
              </View>
              <Text style={styles.participants}>
                {`participants: ${group.users.length}`.toUpperCase()}
              </Text>
            </View>}
          renderFooter={() =>
            <View>
              <Button title={'Leave Group'} onPress={() => this.leaveGroup()} />
              <Button title={'Delete Group'} onPress={() => this.deleteGroup()} />
            </View>}
          renderRow={user =>
            <View style={styles.user}>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://facebook.github.io/react/img/logo_og.png',
                }}
              />
              <Text style={styles.username}>
                {user.username}
              </Text>
            </View>}
        />
      </View>
    );
  }
}
