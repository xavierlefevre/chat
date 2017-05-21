// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from 'ChatApp/src/styles/global.style';

const showPopup = () => {};

const AddPeopleIcon = () => (
  <TouchableOpacity onPress={() => showPopup()} style={{ marginTop: 2 }}>
    <Icon name="plus" size={22} color={globalStyles.colors.blue} />
  </TouchableOpacity>
);

export default AddPeopleIcon;
