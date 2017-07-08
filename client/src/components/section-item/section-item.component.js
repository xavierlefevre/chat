// @flow
import React from 'react';
import { Text } from 'react-native';

type SectionItemPropsType = {
  title: string,
};

export default (props: SectionItemPropsType) =>
  <Text style={{ color: 'blue' }}>
    {props.title}
  </Text>;
