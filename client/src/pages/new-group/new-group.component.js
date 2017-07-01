// @flow
/* eslint no-bitwise: 0 */
import { _ } from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, View, Button } from 'react-native';
import AlphabetListView from 'react-native-alphabetlistview';
import update from 'immutability-helper';

import { SelectedUserList, Cell, SectionHeader, SectionItem } from 'ChatApp/src/components';
import { sortObject } from 'ChatApp/src/services/utils';

import styles from './new-group.style';

type PropsType = {
  auth: {
    id: number,
    jwt: string,
  },
  loading: boolean,
  user: UserType,
  selected: Array<FriendType>,
  navigation: NavigationPropsType & {
    state: {
      params: {
        selected: Array<FriendType>,
        mode: string,
      },
    },
  },
};
type StateType = {
  selected: Array<FriendType>,
  friends: { A?: FriendType },
};

export default class NewGroup extends Component {
  props: PropsType;
  state: StateType;

  static navigationOptions = ({ navigation: { state } }: { navigation: { state: any } }) => {
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group',
      headerRight: isReady ? <Button title="Next" onPress={state.params.finalizeGroup} /> : undefined,
    };
  };

  constructor(props: PropsType) {
    super(props);
    let selected = [];
    if (this.props.navigation.state.params) {
      selected = this.props.navigation.state.params.selected;
    }

    this.state = {
      selected: selected || [],
      friends: props.user ? _.groupBy(props.user.friends, friend => friend.username.charAt(0).toUpperCase()) : {},
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
      Object.assign(state, { selected: nextProps.selected });
    }

    this.setState(state);
  }

  componentWillUpdate(nextProps: PropsType, nextState: StateType) {
    if (!!this.state.selected.length !== !!nextState.selected.length) {
      this.refreshNavigation(nextState.selected);
    }
  }

  refreshNavigation(selected: Array<any>) {
    const { navigation } = this.props;
    navigation.setParams({
      mode: selected && selected.length ? 'ready' : undefined,
      finalizeGroup: this.finalizeGroup,
    });
  }

  finalizeGroup() {
    const { navigate } = this.props.navigation;
    navigate('FinalizeGroup', {
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
      return this.setState({ selected });
    }

    const selected = [...this.state.selected, user];
    return this.setState({ selected });
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
              <SelectedUserList data={this.state.selected} remove={this.toggle} />
            </View>
          : undefined}
        {_.keys(this.state.friends).length
          ? <AlphabetListView
              style={{ flex: 1 }}
              data={this.state.friends}
              cell={Cell}
              cellHeight={30}
              cellProps={{
                isSelected: this.isSelected,
                toggle: this.toggle,
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
