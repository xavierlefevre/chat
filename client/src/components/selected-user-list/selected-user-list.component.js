// @flow
import React, { Component } from 'react';
import { ListView } from 'react-native';

import SelectedUserListItem from './selected-user-list-item.component';
import styles from './selected-user-list.style';

type PropsType = {
  dataSource: {},
  remove: any => void,
};

export default class SelectedUserList extends Component {
  props: PropsType;

  renderRow(user: any) {
    return <SelectedUserListItem user={user} remove={this.props.remove} />;
  }

  render() {
    return (
      <ListView
        dataSource={this.props.dataSource}
        renderRow={user => this.renderRow(user)}
        horizontal
        style={styles.list}
      />
    );
  }
}
