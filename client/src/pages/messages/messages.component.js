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

import styles from './messages.style';
import Message from './message.component';
import MessageInput from './message-input.component';

type PropsType = {
  auth: {
    id: number,
    jwt: string,
  },
  group: GroupType,
  loading: boolean,
  groupId: number,
  title: string,
  createMessage: () => void,
  loadMoreEntries: () => Promise<any>,
  subscribeToMessages: () => void,
};
type StateType = {
  ds: any,
  usernameColors: {},
  shouldScrollToBottom: boolean,
  refreshing: boolean,
  height: number,
};

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
    height: 0,
  };

  componentWillReceiveProps(nextProps: PropsType) {
    const oldData = this.props;
    const newData = nextProps;
    const usernameColors = {};

    if (newData.group) {
      if (newData.group.users) {
        newData.group.users.map(user => {
          usernameColors[user.username] = this.state.usernameColors[user.username] || randomColor();
          return usernameColors[user.username];
        });
      }

      if (!!newData.group.messages && (!oldData.group || newData.group.messages !== oldData.group.messages)) {
        this.setState({
          ds: this.state.ds.cloneWithRows(newData.group.messages.slice().reverse()),
          usernameColors,
        });
      }
    }

    if (!this.subscription && !newData.loading) {
      this.subscription = newData.subscribeToMessages(newData.groupId);
    }
  }

  componentDidMount() {
    this.renderTitle();
  }

  onContentSizeChange(w: number, h: number) {
    if (this.state.shouldScrollToBottom && this.state.height < h) {
      this.listView.scrollToEnd({ animated: true });
      this.setState({
        shouldScrollToBottom: false,
      });
    }
  }

  onLayout(e: { nativeEvent: { layout: { height: number } } }) {
    const { height } = e.nativeEvent.layout;
    this.setState({ height });
  }

  groupDetails() {
    Actions.groupDetails({ id: this.props.groupId });
  }

  send(text: string) {
    this.props.createMessage({
      groupId: this.props.groupId,
      userId: this.props.auth.id,
      text,
    });

    this.setState({
      shouldScrollToBottom: true,
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
            <Image
              style={styles.titleImage}
              source={{
                uri: 'https://facebook.github.io/react/img/logo_og.png',
              }}
            />
            <Text>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    const { auth, loading, group } = this.props;

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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
          onContentSizeChange={(w, h) => this.onContentSizeChange(w, h)}
          onLayout={e => this.onLayout(e)}
          renderRow={message => (
            <Message
              color={this.state.usernameColors[message.from.username]}
              message={message}
              isCurrentUser={message.from.id === auth.id}
            />
          )}
        />
        <MessageInput send={text => this.send(text)} />
      </KeyboardAvoidingView>
    );
  }
}
