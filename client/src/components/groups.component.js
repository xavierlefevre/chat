// @flow

import React, { Component } from 'react';
import { ActivityIndicator, ListView, Platform, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Group from './group.component';

const styles = StyleSheet.create({
  container: {
    marginBottom: 50, // tab bar height
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
});

type PropsType = {
  loading: number,
  user: {
    id: number,
    email: string,
    groups: Array<{
      id: number,
      name: string,
    }>,
  },
};
type StateType = {
  ds: any,
};

class Groups extends Component {
  props: PropsType;
  state: StateType;

  state = {
    ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
  };

  componentWillReceiveProps(nextProps: PropsType) {
    if (!nextProps.loading && nextProps.user !== this.props.user) {
      this.setState({
        ds: this.state.ds.cloneWithRows(nextProps.user.groups),
      });
    }
  }

  goToMessages(group: GroupType) {
    Actions.messages({ groupId: group.id, title: group.name });
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={(group: GroupType) => <Group group={group} goToMessages={() => this.goToMessages(group)} />}
        />
      </View>
    );
  }
}

export default Groups;
