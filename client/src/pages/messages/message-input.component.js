// @flow
import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './message-input.style';

const sendButton = send =>
  <Icon.Button
    backgroundColor={'blue'}
    borderRadius={16}
    color={'white'}
    iconStyle={styles.iconStyle}
    name="send"
    onPress={send}
    size={16}
    style={styles.sendButton}
  />;

type PropsType = { send: string => void };
type StateType = { text: string };

export default class MessageInput extends Component {
  props: PropsType;
  state: StateType;
  textInput: any;

  state = {
    text: '',
  };

  send() {
    this.props.send(this.state.text);
    this.textInput.clear();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref => {
              this.textInput = ref;
            }}
            onChangeText={text => this.setState({ text })}
            style={styles.input}
            placeholder="Type your message here!"
          />
        </View>
        <View style={styles.sendButtonContainer}>
          {sendButton(() => this.send())}
        </View>
      </View>
    );
  }
}
