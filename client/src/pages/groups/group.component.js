// @flow
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
});

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
