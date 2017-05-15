// @flow
import React, { Component } from 'react';
import { ActivityIndicator, ListView, View, Button, Text, RefreshControl } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Group from './group.component';
import styles from './groups.style';

type PropsType = {
  auth: {
    loading: boolean,
    id: number,
    jwt: string,
  },
  loading: boolean,
  user: UserType,
  refetch: () => Promise<any>,
  subscribeToGroups: () => void,
  subscribeToMessages: () => void,
};
type StateType = {
  ds: any,
  refreshing: boolean,
};

const Header = () => (
  <View style={styles.header}>
    <Button title={'New Group'} onPress={Actions.newGroup} />
  </View>
);

export default class Groups extends Component {
  props: PropsType;
  state: StateType;
  messagesSubscription: any;
  groupSubscription: any;

  state = {
    ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    refreshing: false,
  };

  componentWillReceiveProps(nextProps: PropsType) {
    if (!nextProps.auth.jwt && !nextProps.auth.loading) {
      Actions.signin();
    } else if (
      nextProps.user &&
      nextProps.user.groups &&
      // check for new messages
      (!this.props.user || nextProps.user.groups !== this.props.user.groups)
    ) {
      // convert groups Array to ListView.DataSource
      // we will use this.state.ds to populate our ListView
      this.setState({
        // cloneWithRows computes a diff and decides whether to rerender
        ds: this.state.ds.cloneWithRows(nextProps.user.groups),
      });
    }

    if (nextProps.user && (!this.props.user || nextProps.user.groups.length !== this.props.user.groups.length)) {
      if (this.messagesSubscription) {
        this.messagesSubscription(); // unsubscribe from old
      }

      if (nextProps.user.groups.length) {
        this.messagesSubscription = nextProps.subscribeToMessages(); // subscribe to new
      }
    }

    if (!this.groupSubscription && nextProps.user) {
      this.groupSubscription = nextProps.subscribeToGroups();
    }
  }

  goToMessages(group: GroupType) {
    Actions.messages({ groupId: group.id, title: group.name });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.refetch().then(() => {
      this.setState({ refreshing: false });
    });
  }

  render() {
    const { auth, loading, user } = this.props;

    // render loading placeholder while we fetch messages
    if (auth.loading || loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    if (user && !user.groups.length) {
      return (
        <View style={styles.container}>
          <Header />
          <Text style={styles.warning}>{'You do not have any groups.'}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          dataSource={this.state.ds}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
          renderHeader={() => <Header />}
          renderRow={(group: GroupType) => <Group group={group} goToMessages={() => this.goToMessages(group)} />}
        />
      </View>
    );
  }
}
