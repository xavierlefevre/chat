// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';

import SelectedUserListItem from './selected-user-list-item.component';
import styles from './selected-user-list.style';

type PropsType = {
  data: any[],
  remove: any => void,
};

export default class SelectedUserList extends Component {
  props: PropsType;

  keyExtractor = (item: { id: * }) => item.id;

  renderItem({ item: user }: any) {
    return <SelectedUserListItem user={user} remove={this.props.remove} />;
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={(item: any) => this.keyExtractor(item)}
        renderItem={(item: any) => this.renderItem(item)}
        horizontal
        style={styles.list}
      />
    );
  }
}
