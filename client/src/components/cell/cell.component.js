// @flow
import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './cell.style';

type PropsType = {
  isSelected: FriendType => number,
  item: FriendType,
  toggle: () => void,
};
type StateType = {
  isSelected: number,
};

export default class Cell extends Component {
  props: PropsType;
  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = { isSelected: props.isSelected(props.item) };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    this.setState({
      isSelected: nextProps.isSelected(nextProps.item),
    });
  }

  toggle() {
    this.props.toggle(this.props.item);
  }

  render() {
    return (
      <View style={styles.cellContainer}>
        <Image style={styles.cellImage} source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }} />
        <Text style={styles.cellLabel}>
          {this.props.item.username}
        </Text>
        <View style={styles.checkButtonContainer}>
          <Icon.Button
            backgroundColor={this.state.isSelected ? 'blue' : 'white'}
            borderRadius={12}
            color={'white'}
            iconStyle={styles.checkButtonIcon}
            name={'check'}
            onPress={this.toggle}
            size={16}
            style={styles.checkButton}
          />
        </View>
      </View>
    );
  }
}
