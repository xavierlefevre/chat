// @flow
import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

import styles from './message.style';

type PropsType = {
  color: string,
  message: MessageType,
  isCurrentUser: boolean,
};

export default ({ color, message, isCurrentUser }: PropsType) =>
  <View key={message.id} style={styles.container}>
    {isCurrentUser ? <View style={styles.messageSpacer} /> : undefined}
    <View style={[styles.message, isCurrentUser && styles.myMessage]}>
      <Text style={[styles.messageUsername, { color }]}>
        {message.from.username}
      </Text>
      <Text>
        {message.text}
      </Text>
      <Text style={styles.messageTime}>
        {moment(message.createdAt).format('h:mm A')}
      </Text>
    </View>
    {!isCurrentUser ? <View style={styles.messageSpacer} /> : undefined}
  </View>;
