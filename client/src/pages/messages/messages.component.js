// @flow
import React, { Component } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, ListView, View, TouchableOpacity, Image, Text } from 'react-native';
import randomColor from 'randomcolor';
import { Actions } from 'react-native-router-flux';

import styles from './messages.style';
import Message from './message.component';
import MessageInput from './message-input.component';

type PropsType = {
  group: GroupType,
  loading: boolean,
  groupId: number,
  title: string,
  createMessage: () => void,
};
type StateType = {
  ds: any,
  usernameColors: {},
  shouldScrollToBottom: boolean,
};

export default class Messages extends Component {
  props: PropsType;
  state: StateType;
  listView: any;

  state = {
    ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    usernameColors: {},
    shouldScrollToBottom: false,
  };

  componentWillReceiveProps(nextProps: PropsType) {
    const oldData = this.props;
    const newData = nextProps;
    const usernameColors = {};

    if (newData.group) {
      if (newData.group.users) {
        newData.group.users.map(user => {
          usernameColors[user.username] = this.state.usernameColors[user.username] || randomColor();
        });
      }
      if (!!newData.group.messages && (!oldData.group || newData.group.messages !== oldData.group.messages)) {
        this.setState({
          ds: this.state.ds.cloneWithRows(newData.group.messages.slice().reverse()),
          usernameColors,
        });
        this.setState({
          shouldScrollToBottom: true,
        });
      }
    }
  }

  componentDidMount() {
    this.renderTitle();
  }

  groupDetails() {
    Actions.groupDetails({ id: this.props.groupId });
  }

  send(text: string) {
    this.props.createMessage({
      groupId: this.props.groupId,
      userId: 1, // faking the user for now
      text,
    });
  }

  renderTitle() {
    Actions.refresh({
      renderTitle: () => (
        <TouchableOpacity style={styles.titleWrapper} onPress={() => this.groupDetails()}>
          <View style={styles.title}>
            <Image style={styles.titleImage} source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }} />
            <Text>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    const { loading, group } = this.props;

    if (loading && !group) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView behavior={'position'} contentContainerStyle={styles.container} style={styles.container}>
        <ListView
          ref={ref => {
            this.listView = ref;
          }}
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          onContentSizeChange={() => {
            if (this.state.shouldScrollToBottom) {
              this.listView.scrollToEnd({ animated: true });
              this.setState({
                shouldScrollToBottom: false,
              });
            }
          }}
          renderRow={message => (
            <Message
              color={this.state.usernameColors[message.from.username]}
              message={message}
              isCurrentUser={message.from.id === 1} // for now until we implement auth
            />
          )}
        />
        <MessageInput send={(text: string) => this.send(text)} />
      </KeyboardAvoidingView>
    );
  }
}
