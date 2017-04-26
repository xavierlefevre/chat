import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ListView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React, { Component, PropTypes } from 'react';
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

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      usernameColors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props;
    const newData = nextProps;
    const usernameColors = {};

    if (newData.group) {
      if (newData.group.users) {
        newData.group.users.map(user => {
          usernameColors[user.username] =
            this.state.usernameColors[user.username] || randomColor();
        });
      }
      if (
        !!newData.group.messages &&
        (!oldData.group || newData.group.messages !== oldData.group.messages)
      ) {
        this.setState({
          ds: this.state.ds.cloneWithRows(
            newData.group.messages.slice().reverse()
          ),
          usernameColors,
        });
        this.setState({
          shouldScrollToBottom: true,
        });
      }
    }
  }

  send(text) {
    this.props.createMessage({
      groupId: this.props.groupId,
      userId: 1, // faking the user for now
      text,
    });
  }

  render() {
    const { loading, group } = this.props;
    // render loading placeholder while we fetch messages
    if (loading && !group) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    // render list of messages for group
    return (
      <KeyboardAvoidingView
        behavior={'position'}
        contentContainerStyle={styles.container}
        style={styles.container}
      >
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
        <MessageInput send={text => this.send(text)} />
      </KeyboardAvoidingView>
    );
  }
}

Messages.propTypes = {
  group: PropTypes.shape({
    messages: PropTypes.array,
    users: PropTypes.array,
  }),
  loading: PropTypes.bool,
  groupId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createMessage: PropTypes.func,
};

export default Messages;
