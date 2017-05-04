// @flow
import React, { Component } from 'react';
import { ActivityIndicator, ListView, View, Button, Text, RefreshControl } from 'react-native';
import { Actions } from 'react-native-router-flux';
import update from 'immutability-helper';
import { map } from 'lodash';

import Group from './group.component';
import styles from './groups.style';
import { MESSAGE_ADDED_SUBSCRIPTION, GROUP_ADDED_SUBSCRIPTION } from '../../queries';

function isDuplicateDocument(newDocument, existingDocuments) {
  return newDocument.id !== null && existingDocuments.some(doc => newDocument.id === doc.id);
}

type PropsType = {
  loading: boolean,
  user: UserType,
  refetch: () => Promise<any>,
  subscribeToMore: () => void,
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
    if (nextProps.user && !nextProps.loading && nextProps.user !== this.props.user) {
      this.setState({
        ds: this.state.ds.cloneWithRows(nextProps.user.groups),
      });
    }

    if (!this.messagesSubscription && !nextProps.loading) {
      this.messagesSubscription = nextProps.subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: { groupIds: map(nextProps.user.groups, 'id') },
        updateQuery: (previousResult, { subscriptionData }) => {
          const previousGroups = previousResult.user.groups;
          const newMessage = subscriptionData.data.messageAdded;

          const groupIndex = map(previousGroups, 'id').indexOf(newMessage.to.id);
          // if it's our own mutation
          // we might get the subscription result
          // after the mutation result.
          if (isDuplicateDocument(newMessage, previousGroups[groupIndex].messages)) {
            return previousResult;
          }
          return update(previousResult, {
            user: {
              groups: {
                [groupIndex]: {
                  messages: { $set: [newMessage] },
                },
              },
            },
          });
        },
      });
    }

    if (!this.groupSubscription && !nextProps.loading) {
      this.groupSubscription = nextProps.subscribeToMore({
        document: GROUP_ADDED_SUBSCRIPTION,
        variables: { userId: 1 }, // last time we'll fake the user!
        updateQuery: (previousResult, { subscriptionData }) => {
          console.log('previousResult', previousResult);
          console.log('subscriptionData', subscriptionData);
          const previousGroups = previousResult.user.groups;
          const newGroup = subscriptionData.data.groupAdded;
          // if it's our own mutation
          // we might get the subscription result
          // after the mutation result.
          if (isDuplicateDocument(newGroup, previousGroups)) {
            return previousResult;
          }
          return update(previousResult, {
            user: {
              groups: { $push: [newGroup] },
            },
          });
        },
      });
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
    const { loading, user } = this.props;

    if (loading) {
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
