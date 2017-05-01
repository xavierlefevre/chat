// @flow
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import styles from './group.style';

type PropsType = {
  goToMessages: () => void,
  group: GroupType,
};

export default function(props: PropsType) {
  const { id, name } = props.group;
  return (
    <TouchableHighlight key={id} onPress={props.goToMessages}>
      <View style={styles.groupContainer}>
        <Text style={styles.groupName}>{`${name}`}</Text>
      </View>
    </TouchableHighlight>
  );
}
