// @flow
import { ActivityIndicator, KeyboardAvoidingView, ListView, Platform, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import randomColor from 'randomcolor';

import Message from './message.component';
import MessageInput from './message-input.component';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 32,
  },
  loading: {
    justifyContent: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 15,
      },
      android: {
        top: 5,
      },
    }),
    left: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

type PropsType = {
  group: {
    messages: Array<any>,
    users: Array<any>,
  },
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
type ListViewType = any;

export default class Messages extends Component {
  props: PropsType;
  state: StateType;
  listView: ListViewType;

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

  send(text: string) {
    this.props.createMessage({
      groupId: this.props.groupId,
      userId: 1, // faking the user for now
      text,
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
