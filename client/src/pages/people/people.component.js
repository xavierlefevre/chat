// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { _ } from 'lodash';
import AlphabetListView from 'react-native-alphabetlistview';

import { SectionItem, Cell, Prompt } from 'ChatApp/src/components';
import { sortObject } from 'ChatApp/src/services/utils';

import styles from './people.style';
import AddPeopleIcon from './add-people-icon.container';

type PropsType = {
  friends: Array<FriendType>,
  promptShown: boolean,
  togglePrompt: () => void,
  addFriend: string => Promise<any>,
};
type StateType = {
  friends: { A?: FriendType },
};

export default class People extends Component {
  props: PropsType;
  state: StateType;

  static navigationOptions = {
    title: 'People',
    headerRight: <AddPeopleIcon />,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      friends: props.friends
        ? sortObject(
            _.groupBy(props.friends, friend =>
              friend.username.charAt(0).toUpperCase()
            )
          )
        : {},
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const state = {};
    if (nextProps.friends && nextProps.friends !== this.props.friends) {
      state.friends = sortObject(
        _.groupBy(nextProps.friends, friend =>
          friend.username.charAt(0).toUpperCase()
        )
      );
    }

    this.setState(state);
  }

  render() {
    return (
      <View style={styles.container}>
        <AlphabetListView
          style={{ flex: 1 }}
          data={this.state.friends}
          cell={Cell}
          cellProps={{
            isSelected: () => {},
            toggle: () => {},
          }}
          cellHeight={30}
          sectionListItem={SectionItem}
          sectionHeaderHeight={22.5}
        />
        <Prompt
          title="Add a friend"
          placeholder="Enter your friend username"
          visible={this.props.promptShown}
          onCancel={() => this.props.togglePrompt()}
          onSubmit={(value: string) => {
            this.props
              .addFriend(value)
              .then(() => {
                this.props.togglePrompt();
              })
              .catch(e => {
                console.log(e); // eslint-disable-line no-console
              });
          }}
        />
      </View>
    );
  }
}
