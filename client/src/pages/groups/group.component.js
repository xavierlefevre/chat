// @flow
import React from 'react';
import { Text, TouchableHighlight, View, Image } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './group.style';

// format createdAt with moment
const formatCreatedAt = createdAt =>
  moment(createdAt).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'DD/MM/YYYY',
  });

type PropsType = {
  goToMessages: () => void,
  group: GroupType,
};

export default function(props: PropsType) {
  const { id, name, messages } = props.group;
  return (
    <TouchableHighlight key={id} onPress={props.goToMessages}>
      <View style={styles.groupContainer}>
        <Image
          style={styles.groupImage}
          source={{
            uri: 'https://facebook.github.io/react/img/logo_og.png',
          }}
        />
        <View style={styles.groupTextContainer}>
          <View style={styles.groupTitleContainer}>
            <Text style={styles.groupName}>{`${name}`}</Text>
            <Text style={styles.groupLastUpdated}>
              {messages.length ? formatCreatedAt(messages[0].createdAt) : ''}
            </Text>
          </View>
          <Text style={styles.groupUsername}>
            {messages.length ? `${messages[0].from.username}:` : ''}
          </Text>
          <Text style={styles.groupText} numberOfLines={1}>
            {messages.length ? messages[0].text : ''}
          </Text>
        </View>
        <Icon name="angle-right" size={24} color={'#8c8c8c'} />
      </View>
    </TouchableHighlight>
  );
}
