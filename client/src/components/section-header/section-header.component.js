// @flow
import React from 'react';
import { Text, View } from 'react-native';

import styles from './section-header.style';

type SectionHeaderPropsType = {
  title: string,
};

export default (props: SectionHeaderPropsType) =>
  <View style={styles.view}>
    <Text style={styles.text}>
      {props.title}
    </Text>
  </View>;
