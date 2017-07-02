// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from 'ChatApp/src/styles/global.style';

type PropsType = {
  togglePrompt: () => void,
};

export default (props: PropsType) =>
  <TouchableOpacity
    onPress={() => props.togglePrompt()}
    style={{ marginTop: 8, marginRight: 10, marginBottom: 5, marginLeft: 5 }}
  >
    <Icon name="plus" size={22} color={globalStyles.colors.blue} />
  </TouchableOpacity>;
