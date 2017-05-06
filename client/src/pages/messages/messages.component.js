// @flow
import React, { Component } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  ListView,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import randomColor from 'randomcolor';
import { Actions } from 'react-native-router-flux';
import update from 'immutability-helper';

import styles from './messages.style';
import Message from './message.component';
import MessageInput from './message-input.component';
import { MESSAGE_ADDED_SUBSCRIPTION } from '../../graphql';

type PropsType = {
  group: GroupType,
  loading: boolean,
  groupId: number,
  title: string,
  createMessage: () => void,
  loadMoreEntries: () => Promise<any>,
  subscribeToMore: () => void,
};
type StateType = {
  ds: any,
  usernameColors: {},
  shouldScrollToBottom: boolean,
  refreshing: boolean,
};

function isDuplicateMessage(newMessage, existingMessages) {
  return newMessage.id !== null && existingMessages.some(message => newMessage.id === message.id);
}

export default class Messages extends Component {
  props: PropsType;
  state: StateType;
  listView: any;
  subscription: any;

  state = {
    ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    usernameColors: {},
    shouldScrollToBottom: false,
    refreshing: false,
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

    if (!this.subscription && !newData.loading) {
      this.subscription = newData.subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: { groupIds: [newData.groupId] },
        updateQuery: (previousResult, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          // if it's our own mutation
          // we might get the subscription result
          // after the mutation result.
          if (isDuplicateMessage(newMessage, previousResult.group.messages)) {
            return previousResult;
          }
          return update(previousResult, {
            group: {
              messages: {
                $unshift: [newMessage],
              },
            },
          });
        },
      });
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

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.loadMoreEntries().then(() => {
      this.setState({
        refreshing: false,
      });
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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
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
