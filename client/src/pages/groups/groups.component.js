// @flow
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, View, Button, Text } from 'react-native';
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
  networkStatus: number,
  user: UserType,
  refetch: () => Promise<any>,
  subscribeToGroups: () => void,
  subscribeToMessages: () => void,
};
type FlatListItemType = {
  index: number,
  item: GroupType,
};

const Header = () => (
  <View style={styles.header}>
    <Button title={'New Group'} onPress={Actions.newGroup} />
  </View>
);

export default class Groups extends Component {
  props: PropsType;
  messagesSubscription: any;
  groupSubscription: any;

  componentWillReceiveProps(nextProps: PropsType) {
    if (!nextProps.auth.jwt && !nextProps.auth.loading) {
      Actions.signin();
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

  render() {
    const { loading, networkStatus, user, refetch } = this.props;

    // render loading placeholder while we fetch messages
    if (loading || !user) {
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
        <FlatList
          data={user.groups}
          keyExtractor={(group: GroupType) => group.id}
          renderItem={({ item: group }: FlatListItemType) => (
            <Group group={group} goToMessages={() => this.goToMessages(group)} />
          )}
          ListHeaderComponent={() => <Header />}
          onRefresh={() => refetch()}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
