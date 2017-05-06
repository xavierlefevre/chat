// @flow
import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './selected-user-list-item.style';

type PropsType = {
  user: FriendType,
  remove: FriendType => void,
};

export default class SelectedUserListItem extends Component {
  props: PropsType;

  remove() {
    this.props.remove(this.props.user);
  }

  render() {
    const { username } = this.props.user;

    return (
      <View style={styles.itemContainer}>
        <View>
          <Image style={styles.itemImage} source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }} />
          <TouchableOpacity onPress={() => this.remove()} style={styles.itemIcon}>
            <Icon color={'white'} name={'times'} size={12} />
          </TouchableOpacity>
        </View>
        <Text>{username}</Text>
      </View>
    );
  }
}
