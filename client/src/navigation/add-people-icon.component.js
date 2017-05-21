// @flow
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from 'ChatApp/src/styles/global.style';

const AddPeopleIcon = () => (
  <View>
    <Icon name="plus" size={16} color={globalStyles.colors.blue} />
  </View>
);

export default AddPeopleIcon;
