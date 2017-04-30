// @flow
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: '#dbdbdb',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    top: -3,
    width: 20,
  },
  itemImage: {
    borderRadius: 27,
    height: 54,
    width: 54,
  },
});

type PropsType = {
  user: {
    id: number,
    username: string,
  },
  remove: ({
    username: string,
    id: any,
  }) => void,
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
