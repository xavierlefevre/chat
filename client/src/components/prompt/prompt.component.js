// @flow
import React, { Component } from 'react';
import { Modal, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import styles from './prompt.style';

type PropsType = {
  title: string,
  visible: boolean,
  defaultValue: string,
  placeholder: string,
  onCancel: () => void,
  cancelText: string,
  onSubmit: () => void,
  submitText: string,
  onChangeText: () => void,
  borderColor: string,
  promptStyle: {},
  titleStyle: {},
  buttonStyle: {},
  buttonTextStyle: {},
  submitButtonStyle: {},
  submitButtonTextStyle: {},
  cancelButtonStyle: {},
  cancelButtonTextStyle: {},
  inputStyle: {},
  textInputProps: {},
};
type StateType = {
  value: string,
  visible: boolean,
};

export default class Prompt extends Component {
  props: PropsType;
  state: StateType;

  static defaultProps = {
    visible: false,
    defaultValue: '',
    cancelText: 'Cancel',
    submitText: 'OK',
    borderColor: '#ccc',
    promptStyle: {},
    titleStyle: {},
    buttonStyle: {},
    buttonTextStyle: {},
    submitButtonStyle: {},
    submitButtonTextStyle: {},
    cancelButtonStyle: {},
    cancelButtonTextStyle: {},
    inputStyle: {},
    onChangeText: () => {},
  };

  state = {
    value: '',
    visible: false,
  };

  componentWillMount() {
    this.setState({ value: this.props.defaultValue });
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const { visible, defaultValue } = nextProps;
    this.setState({ visible, value: defaultValue });
  }

  onChangeText = (value: string) => {
    this.setState({ value });
    this.props.onChangeText(value);
  };

  onSubmitPress = () => {
    const { value } = this.state;
    this.props.onSubmit(value);
  };

  onCancelPress = () => {
    this.props.onCancel();
  };

  close = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <Modal onRequestClose={() => this.close()} transparent visible={this.props.visible}>
        <View style={styles.dialog} key="prompt">
          <View style={styles.dialogOverlay} />
          <View style={[styles.dialogContent, { borderColor: this.props.borderColor }, this.props.promptStyle]}>
            <View style={[styles.dialogTitle, { borderColor: this.props.borderColor }]}>
              <Text style={[styles.dialogTitleText, this.props.titleStyle]}>
                {this.props.title}
              </Text>
            </View>
            <View style={styles.dialogBody}>
              <TextInput
                style={[styles.dialogInput, this.props.inputStyle]}
                defaultValue={this.props.defaultValue}
                onChangeText={this.onChangeText}
                placeholder={this.props.placeholder}
                autoFocus
                underlineColorAndroid="white"
                {...this.props.textInputProps}
              />
            </View>
            <View style={[styles.dialogFooter, { borderColor: this.props.borderColor }]}>
              <TouchableWithoutFeedback onPress={this.onCancelPress}>
                <View style={[styles.dialogAction, this.props.buttonStyle, this.props.cancelButtonStyle]}>
                  <Text style={[styles.dialogActionText, this.props.buttonTextStyle, this.props.cancelButtonTextStyle]}>
                    {this.props.cancelText}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onSubmitPress}>
                <View style={[styles.dialogAction, this.props.buttonStyle, this.props.submitButtonStyle]}>
                  <Text style={[styles.dialogActionText, this.props.buttonTextStyle, this.props.submitButtonTextStyle]}>
                    {this.props.submitText}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
