// @flow
import React, { Component } from 'react';
import { ActivityIndicator, Button, Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from './group-details.style';

type PropsType = {
  data: {
    loading: boolean,
    group: GroupType,
  },
  deleteGroup: () => Promise<any>,
  leaveGroup: () => Promise<any>,
  id: number,
};
type StateType = {
  ds: any,
};

export default class GroupDetails extends Component {
  props: PropsType;
  state: StateType;

  constructor(props: PropsType) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(props.data.group.users),
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const newData = nextProps.data;
    const oldData = this.props.data;

    if (!!newData.group && !!newData.group.users && newData.group !== oldData.group) {
      this.setState({ ds: this.state.ds.cloneWithRows(newData.group.users) });
    }
  }

  deleteGroup() {
    this.props
      .deleteGroup({ id: this.props.id })
      .then(() => {
        Actions.tabs({ type: 'reset' });
      })
      .catch(e => {
        console.error(e);
      });
  }

  leaveGroup() {
    this.props
      .leaveGroup({ id: this.props.id, userId: 1 }) // fake user for now
      .then(() => {
        Actions.tabs({ type: 'reset' });
      })
      .catch(e => {
        console.error(e);
      });
  }

  render() {
    const { data } = this.props;

    // render loading placeholder while we fetch messages
    if (!data || data.loading) {
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
          renderHeader={() => (
            <View>
              <View style={styles.detailsContainer}>
                <TouchableOpacity style={styles.groupImageContainer} onPress={() => {}}>
                  <Image
                    style={styles.groupImage}
                    source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
                  />
                  <Text>edit</Text>
                </TouchableOpacity>
                <View style={styles.groupNameBorder}>
                  <Text style={styles.groupName}>{data.group.name}</Text>
                </View>
              </View>
              <Text style={styles.participants}>
                {`participants: ${data.group.users.length}`.toUpperCase()}
              </Text>
            </View>
          )}
          renderFooter={() => (
            <View>
              <Button title={'Leave Group'} onPress={() => this.leaveGroup()} />
              <Button title={'Delete Group'} onPress={() => this.deleteGroup()} />
            </View>
          )}
          renderRow={user => (
            <View style={styles.user}>
              <Image style={styles.avatar} source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }} />
              <Text style={styles.username}>{user.username}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}