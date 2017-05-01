// @flow
import React, { Component } from 'react';
import { ActivityIndicator, ListView, View, Button, Text, RefreshControl } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Group from './group.component';
import styles from './groups.style';

type PropsType = {
  loading: boolean,
  user: UserType,
  refetch: () => Promise<any>,
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
