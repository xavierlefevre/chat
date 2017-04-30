// @flow
/* eslint no-bitwise:0 */
/* eslint no-param-reassign:0 */
import { _ } from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, ListView, Platform, StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AlphabetListView from 'react-native-alphabetlistview';
import update from 'immutability-helper';

import SelectedUserList from '../../components/selected-user-list.component';
import Cell from './cell.component';

const sortObject = obj =>
  Object.keys(obj).sort().reduce((reduced, key) => {
    reduced[key] = obj[key];
    return reduced;
  }, {});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
});

const sectionHeaderStyles = StyleSheet.create({
  view: {
    backgroundColor: '#ccc',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

type SectionHeaderPropsType = {
  title: string,
};

const SectionHeader = (props: SectionHeaderPropsType) => (
  <View style={sectionHeaderStyles.view}>
    <Text style={sectionHeaderStyles.text}>{props.title}</Text>
  </View>
);

type SectionItemPropsType = {
  title: string,
};

const SectionItem = (props: SectionItemPropsType) => <Text style={{ color: 'blue' }}>{props.title}</Text>;

type PropsType = {
  data: {
    loading: boolean,
    user: UserType,
  },
};
type StateType = {
  selected: Array<FriendType>,
  friends: { A?: FriendType },
  ds: any,
};

export default class NewGroup extends Component {
  props: PropsType;
  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      selected: [],
      friends: !!props.data && !!props.data.user
        ? _.groupBy(props.data.user.friends, friend => friend.username.charAt(0).toUpperCase())
        : {},
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    };
  }

  componentDidMount() {
    this.refreshNavigation(this.state.selected);
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const newData = nextProps.data;
    const oldData = this.props.data;

    const state = {};
    if (newData.user && newData.user.friends && newData.user !== oldData.user) {
      state.friends = sortObject(_.groupBy(newData.user.friends, friend => friend.username.charAt(0).toUpperCase()));
    }

    this.setState(state);
  }

  componentWillUpdate(nextProps: PropsType, nextState: StateType) {
    if (!!this.state.selected.length !== !!nextState.selected.length) {
      this.refreshNavigation(nextState.selected);
    }
  }

  refreshNavigation(selected: Array<any>) {
    Actions.refresh({
      onLeft: Actions.pop,
      leftTitle: 'Back',
      rightTitle: selected ? 'Next' : undefined,
      onRight: selected ? () => this.finalizeGroup() : undefined,
      selected,
    });
  }

  finalizeGroup() {
    Actions.finalizeGroup({
      selected: this.state.selected,
      friendCount: this.props.data.user.friends.length,
      userId: this.props.data.user.id,
    });
  }

  isSelected(user: FriendType) {
    return ~this.state.selected.indexOf(user);
  }

  toggle(user: FriendType) {
    const index = this.state.selected.indexOf(user);
    if (~index) {
      const selected = update(this.state.selected, { $splice: [[index, 1]] });

      return this.setState({
        selected,
        ds: this.state.ds.cloneWithRows(selected),
      });
    }

    const selected = [...this.state.selected, user];

    return this.setState({
      selected,
      ds: this.state.ds.cloneWithRows(selected),
    });
  }

  render() {
    const { data } = this.props;

    if (!data || data.loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.state.selected.length
          ? <View style={styles.selected}>
              <SelectedUserList dataSource={this.state.ds} remove={user => this.toggle(user)} />
            </View>
          : undefined}
        {_.keys(this.state.friends).length
          ? <AlphabetListView
              style={{ flex: 1 }}
              data={this.state.friends}
              cell={Cell}
              cellHeight={30}
              cellProps={{
                isSelected: (user: any) => this.isSelected(user),
                toggle: user => this.toggle(user),
              }}
              sectionListItem={SectionItem}
              sectionHeader={SectionHeader}
              sectionHeaderHeight={22.5}
            />
          : undefined}
      </View>
    );
  }
}
