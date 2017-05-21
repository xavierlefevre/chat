// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
  },
});

type TabIconPropsType = {
  selected: boolean,
  title: string,
};

const TabIcon = (props: TabIconPropsType) => (
  <View style={styles.container}>
    <Text style={[styles.tabText, props.selected ? styles.selected : undefined]}>
      {props.title}
    </Text>
  </View>
);

export default TabIcon;
