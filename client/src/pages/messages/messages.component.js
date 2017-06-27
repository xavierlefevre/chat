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
  Dimensions,
} from 'react-native';
import randomColor from 'randomcolor';

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
  createMessage: () => Promise<any>,
  loadMoreEntries: () => Promise<any>,
  subscribeToMessages: () => void,
  navigation: NavigationPropsType & {
    state: {
      params: {
        groupId: number,
      },
    },
  },
};
type StateType = {
  ds: any,
  usernameColors: {},
  refreshing: boolean,
  height: number,
};
type LayoutEventType = { nativeEvent: { layout: { height: number } } };
type ScrollEventType = {
  nativeEvent: {
    contentSize: { height: number },
    contentOffset: { y: number },
  },
};

export default class Messages extends Component {
  props: PropsType;
  state: StateType;
  listView: any;
  subscription: any;
  reachedBottom: boolean;
  shouldScrollToBottom: boolean;

  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;

    const goToGroupDetails = () =>
      navigate('GroupDetails', {
        id: state.params.groupId,
        title: state.params.title,
      });

    // TODO: Seperate in a proper function
    return {
      headerTitle: (
        <TouchableOpacity style={styles.titleWrapper} onPress={() => goToGroupDetails()}>
          <View style={styles.title}>
            <Image
              style={styles.titleImage}
              source={{
                uri: 'https://facebook.github.io/react/img/logo_og.png',
              }}
            />
            <Text>{state.params.title}</Text>
          </View>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    usernameColors: {},
    refreshing: false,
    height: 0,
  };
  reachedBottom = false;
  shouldScrollToBottom = false;

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
      this.subscription = newData.subscribeToMessages(newData.navigation.state.params.groupId);
    }
  }

  onContentSizeChange(w: number, h: number) {
    if (this.shouldScrollToBottom && this.state.height < h) {
      this.shouldScrollToBottom = false;
      this.listView.scrollToEnd({ animated: true });
    }
    if (this.reachedBottom) this.listView.scrollToEnd({ animated: true });
  }

  onLayout(e: LayoutEventType) {
    const { height } = e.nativeEvent.layout;
    this.setState({ height });
  }

  onScroll({ nativeEvent: { contentSize, contentOffset } }: ScrollEventType) {
    const headerBarHeight = 64;
    const messageInputHeight = 32 + 13;
    const endThreshold = 25;

    this.reachedBottom =
      contentSize.height - contentOffset.y - endThreshold <
      Dimensions.get('window').height - (headerBarHeight + messageInputHeight);
  }

  groupDetails() {
    // Actions.groupDetails({ id: this.props.groupId });
  }

  send(text: string) {
    this.props
      .createMessage({
        groupId: this.props.navigation.state.params.groupId,
        text,
      })
      .then(() => {
        this.shouldScrollToBottom = true;
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
          ref={ref => (this.listView = ref)}
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
          onContentSizeChange={(w, h) => this.onContentSizeChange(w, h)}
          onLayout={e => this.onLayout(e)}
          onScroll={e => this.onScroll(e)}
          scrollEventThrottle={500}
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
