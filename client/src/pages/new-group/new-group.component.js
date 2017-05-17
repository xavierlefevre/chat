// @flow
/* eslint no-bitwise: 0 */
/* eslint no-param-reassign: 0 */
import { _ } from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, ListView, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AlphabetListView from 'react-native-alphabetlistview';
import update from 'immutability-helper';

import { SelectedUserList } from 'ChatApp/src/components';

import Cell from './cell.component';
import styles, { sectionHeaderStyles } from './new-group.style';

const sortObject = obj =>
  Object.keys(obj).sort().reduce((reduced, key) => {
    reduced[key] = obj[key];
    return reduced;
  }, {});

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
  auth: {
    id: number,
    jwt: string,
  },
  loading: boolean,
  user: UserType,
  selected: Array<FriendType>,
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
      selected: props.selected || [],
      friends: props.user ? _.groupBy(props.user.friends, friend => friend.username.charAt(0).toUpperCase()) : {},
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    };
  }

  componentDidMount() {
    this.refreshNavigation(this.state.selected);
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const state = {};
    if (nextProps.user && nextProps.user.friends && nextProps.user !== this.props.user) {
      state.friends = sortObject(_.groupBy(nextProps.user.friends, friend => friend.username.charAt(0).toUpperCase()));
    }

    if (nextProps.selected) {
      Object.assign(state, {
        selected: nextProps.selected,
        ds: this.state.ds.cloneWithRows(nextProps.selected),
      });
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
      rightTitle: selected && selected.length ? 'Next' : undefined,
      onRight: selected && selected.length ? () => this.finalizeGroup() : undefined,
      selected,
    });
  }

  finalizeGroup() {
    Actions.finalizeGroup({
      selected: this.state.selected,
      friendCount: this.props.user.friends.length,
      userId: this.props.user.id,
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
    const { user, loading } = this.props;

    // render loading placeholder while we fetch messages
    if (loading || !user) {
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
              <SelectedUserList dataSource={this.state.ds} remove={removedUser => this.toggle(removedUser)} />
            </View>
          : undefined}
        {_.keys(this.state.friends).length
          ? <AlphabetListView
              style={{ flex: 1 }}
              data={this.state.friends}
              cell={Cell}
              cellHeight={30}
              cellProps={{
                isSelected: selectedUser => this.isSelected(selectedUser),
                toggle: removedUser => this.toggle(removedUser),
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
