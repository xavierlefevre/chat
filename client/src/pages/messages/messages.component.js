// @flow
import React, { Component } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
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
  networkStatus: number,
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
  flatList: any;
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
        <TouchableOpacity
          style={styles.titleWrapper}
          onPress={() => goToGroupDetails()}
        >
          <View style={styles.title}>
            <Image
              style={styles.titleImage}
              source={{
                uri: 'https://facebook.github.io/react/img/logo_og.png',
              }}
            />
            <Text>
              {state.params.title}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    usernameColors: {},
    height: 0,
  };
  reachedBottom = false;
  shouldScrollToBottom = false;

  componentWillReceiveProps(nextProps: PropsType) {
    const currentProps = this.props;
    const usernameColors = {};

    if (nextProps.group) {
      if (nextProps.group.users) {
        nextProps.group.users.map(user => {
          usernameColors[user.username] =
            this.state.usernameColors[user.username] || randomColor();
          return usernameColors[user.username];
        });
      }

      if (
        !!nextProps.group.messages &&
        (!currentProps.group ||
          nextProps.group.messages !== currentProps.group.messages)
      ) {
        this.setState({ usernameColors });
      }
    }

    if (!this.subscription && !nextProps.loading) {
      this.subscription = nextProps.subscribeToMessages(
        nextProps.navigation.state.params.groupId
      );
    }
  }

  onContentSizeChange(w: number, h: number) {
    if (this.shouldScrollToBottom && this.state.height < h) {
      this.shouldScrollToBottom = false;
      this.flatList.scrollToEnd({ animated: true });
    }
    if (this.reachedBottom) this.flatList.scrollToEnd({ animated: true });
  }

  onLayout(e: LayoutEventType) {
    const { height } = e.nativeEvent.layout;
    this.setState({ height });
  }

  onScroll({ nativeEvent: { contentSize, contentOffset } }: ScrollEventType) {
    const messageInputHeight = 32 + 13;
    const endThreshold = 25;

    this.reachedBottom =
      contentSize.height - contentOffset.y - endThreshold <
      Dimensions.get('window').height - messageInputHeight;
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

  keyExtractor = (item: MessageType) => item.id;

  render() {
    const { auth, loading, group, networkStatus } = this.props;

    if (loading && !group) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={'position'}
        contentContainerStyle={styles.container}
        style={styles.container}
      >
        <FlatList
          ref={ref => (this.flatList = ref)}
          enableEmptySections
          data={this.props.group.messages.slice().reverse()}
          keyExtractor={this.keyExtractor}
          refreshing={networkStatus === 4}
          onRefresh={() => this.props.loadMoreEntries()}
          onContentSizeChange={(w, h) => this.onContentSizeChange(w, h)}
          onLayout={e => this.onLayout(e)}
          onScroll={e => this.onScroll(e)}
          scrollEventThrottle={500}
          renderItem={({ item: message }) =>
            <Message
              color={this.state.usernameColors[message.from.username]}
              message={message}
              isCurrentUser={message.from.id === auth.id}
            />}
        />
        <MessageInput send={text => this.send(text)} />
      </KeyboardAvoidingView>
    );
  }
}
